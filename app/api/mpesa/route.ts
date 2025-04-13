import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { OrderStatus, TransactionStatus, PaymentMethod } from "@prisma/client";

const MPESA_CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY!;
const MPESA_CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET!;
const MPESA_PASSKEY = process.env.MPESA_PASSKEY!;
const MPESA_SHORTCODE = process.env.MPESA_SHORTCODE!;
const MPESA_ENV = process.env.MPESA_ENV || 'sandbox';

const MPESA_AUTH_URL = MPESA_ENV === 'sandbox' 
  ? 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'
  : 'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';

const MPESA_STK_URL = MPESA_ENV === 'sandbox'
  ? 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest'
  : 'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest';

const getBaseUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000';
  }
  return process.env.NEXT_PUBLIC_BASE_URL;
};

// Update validation function
const validateConfig = () => {
  const baseUrl = getBaseUrl();
  
  if (!baseUrl) {
    throw new Error('Base URL not configured');
  }

  if (MPESA_ENV !== 'sandbox' && !baseUrl.startsWith('https')) {
    throw new Error('Production callback URL must use HTTPS');
  }
};

async function getAccessToken(): Promise<string> {
  const auth = Buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`).toString('base64');
  
  try {
    const response = await fetch(MPESA_AUTH_URL, {
      method: 'GET',
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get access token: ${response.statusText}`);
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Access Token Error:', error);
    throw new Error('Failed to get M-Pesa access token');
  }
}

export async function POST(req: Request) {
  try {
    validateConfig();

    const { phoneNumber, amount, orderId } = await req.json();

    if (!phoneNumber || !amount || !orderId) {
      return NextResponse.json(
        { error: "Phone number, amount and orderId are required" },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      // Check if transaction already exists
      const existingTransaction = await tx.transaction.findUnique({
        where: { orderId }
      });

      if (existingTransaction) {
        // If transaction exists, update it instead of creating new
        await tx.transaction.update({
          where: { orderId },
          data: {
            amount: Number(amount),
            status: TransactionStatus.pending,
            method: PaymentMethod.mpesa,
            phoneNumber,
          },
        });
      } else {
        // Get order details
        const order = await tx.order.findUnique({
          where: { id: orderId },
          select: { 
            customerId: true,
            total: true,
            status: true 
          }
        });

        if (!order) {
          throw new Error('Order not found');
        }

        // Create new transaction
        await tx.transaction.create({
          data: {
            orderId,
            customerId: order.customerId,
            amount: Number(amount),
            status: TransactionStatus.pending,
            method: PaymentMethod.mpesa,
            phoneNumber,
          },
        });
      }

      // Get timestamp and generate password
      const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
      const password = Buffer.from(
        `${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`
      ).toString('base64');

      // Get access token outside transaction to avoid timeouts
      const accessToken = await getAccessToken();

      const callbackUrl = `${getBaseUrl()}/api/mpesa/callback`;

      // Make STK push request
      const stkResponse = await fetch(MPESA_STK_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          BusinessShortCode: MPESA_SHORTCODE,
          Password: password,
          Timestamp: timestamp,
          TransactionType: "CustomerPayBillOnline",
          Amount: Math.round(Number(amount)),
          PartyA: phoneNumber,
          PartyB: MPESA_SHORTCODE,
          PhoneNumber: phoneNumber,
          CallBackURL: callbackUrl,
          AccountReference: `Order-${orderId}`,
          TransactionDesc: "Payment for order"
        }),
      });

      if (!stkResponse.ok) {
        await tx.transaction.update({
          where: { orderId },
          data: {
            status: TransactionStatus.failed,
          },
        });
        throw new Error(`STK push failed: ${stkResponse.statusText}`);
      }

      const mpesaResponse = await stkResponse.json();

      if (mpesaResponse.ResponseCode === "0") {
        // Update order and transaction status
        await tx.order.update({
          where: { id: orderId },
          data: { 
            status: OrderStatus.pending
          }
        });

        await tx.transaction.update({
          where: { orderId },
          data: {
            status: TransactionStatus.successful,
          },
        });

        return {
          success: true,
          checkoutRequestID: mpesaResponse.CheckoutRequestID
        };
      }

      // Update transaction to failed if M-Pesa returns error
      await tx.transaction.update({
        where: { orderId },
        data: {
          status: TransactionStatus.failed,
        },
      });
      throw new Error(mpesaResponse.errorMessage || "STK push failed");
    });

    return NextResponse.json(result);

  } catch (error) {
    console.error('M-Pesa API Error:', {
      error,
      env: MPESA_ENV,
      baseUrl: getBaseUrl(),
      timestamp: new Date().toISOString()
    });

    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "Failed to initiate payment",
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}