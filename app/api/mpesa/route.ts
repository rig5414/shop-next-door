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
  // In development, always use localhost
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000';
  }
  
  // In production, use the configured URL
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }

  // Fallback to localhost if nothing else is configured
  return 'http://localhost:3000';
};

// Add this helper function at the top of your file
const formatPhoneNumber = (phoneNumber: string): string => {
  // Remove any spaces or special characters
  let cleaned = phoneNumber.replace(/\D/g, '');
  
  // If number starts with 0, replace with 254
  if (cleaned.startsWith('0')) {
    cleaned = '254' + cleaned.slice(1);
  }
  
  // If number starts with +, remove it
  if (cleaned.startsWith('+')) {
    cleaned = cleaned.slice(1);
  }
  
  // Ensure number starts with 254
  if (!cleaned.startsWith('254')) {
    cleaned = '254' + cleaned;
  }
  
  return cleaned;
};

// Update validation function
const validateConfig = () => {
  const baseUrl = getBaseUrl();
  
  // Add more detailed error logging
  console.log('Environment Config:', {
    baseUrl,
    mpesaEnv: MPESA_ENV,
    nodeEnv: process.env.NODE_ENV,
    hasConsumerKey: !!MPESA_CONSUMER_KEY,
    hasConsumerSecret: !!MPESA_CONSUMER_SECRET,
    hasPasskey: !!MPESA_PASSKEY,
    hasShortcode: !!MPESA_SHORTCODE
  });

  if (!baseUrl) {
    throw new Error('Base URL not configured');
  }

  if (!MPESA_CONSUMER_KEY || !MPESA_CONSUMER_SECRET || !MPESA_PASSKEY || !MPESA_SHORTCODE) {
    throw new Error('Missing M-Pesa configuration');
  }
};

async function getAccessToken(): Promise<string> {
  const auth = Buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`).toString('base64');
  
  try {
    const response = await fetch(MPESA_AUTH_URL, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store' // Disable caching
    });

    const data = await response.json();
    
    if (!response.ok || !data.access_token) {
      console.error('Access Token Response:', data);
      throw new Error(`Failed to get access token: ${response.statusText}`);
    }

    return data.access_token;
  } catch (error) {
    console.error('Access Token Error:', {
      error,
      consumerKeyLength: MPESA_CONSUMER_KEY?.length,
      consumerSecretLength: MPESA_CONSUMER_SECRET?.length,
      authUrl: MPESA_AUTH_URL
    });
    throw error;
  }
}

export async function POST(req: Request) {
  try {
    validateConfig();

    const { phoneNumber, amount, orderId } = await req.json();

    // Validate inputs first
    if (!phoneNumber || !amount || !orderId) {
      return NextResponse.json(
        { error: "Phone number, amount and orderId are required" },
        { status: 400 }
      );
    }

    const formattedPhone = formatPhoneNumber(phoneNumber);
    
    if (!/^254(7|1)\d{8}$/.test(formattedPhone)) {
      return NextResponse.json(
        { error: "Invalid Safaricom phone number" },
        { status: 400 }
      );
    }

    // Get M-Pesa access token and prepare STK push data first
    const accessToken = await getAccessToken();
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    const password = Buffer.from(
      `${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`
    ).toString('base64');

    // Make STK push request before database transaction
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
        PartyA: formattedPhone,
        PartyB: MPESA_SHORTCODE,
        PhoneNumber: formattedPhone,
        CallBackURL: `${getBaseUrl()}/api/mpesa/callback`,
        AccountReference: orderId.slice(0, 12),
        TransactionDesc: "Payment for order"
      }),
    });

    const responseText = await stkResponse.text();
    console.log('STK Raw Response:', responseText);

    let mpesaResponse;
    try {
      mpesaResponse = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse STK response:', responseText);
      throw new Error('Invalid response from M-Pesa');
    }

    // Now handle database updates with a shorter transaction
    const result = await prisma.$transaction(async (tx) => {
      // Check order exists
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

      // Update or create transaction
      const transactionData = {
        orderId,
        customerId: order.customerId,
        amount: Number(amount),
        status: mpesaResponse.ResponseCode === "0" ? 
          TransactionStatus.pending : 
          TransactionStatus.failed,
        method: PaymentMethod.mpesa,
        phoneNumber: formattedPhone,
      };

      const transaction = await tx.transaction.upsert({
        where: { orderId },
        create: transactionData,
        update: transactionData,
      });

      // Update order status if STK push was successful
      if (mpesaResponse.ResponseCode === "0") {
        await tx.order.update({
          where: { id: orderId },
          data: { status: OrderStatus.pending }
        });

        return {
          success: true,
          checkoutRequestID: mpesaResponse.CheckoutRequestID
        };
      }

      throw new Error(mpesaResponse.errorMessage || "STK push failed");
    }, {
      timeout: 10000 // Increase timeout to 10 seconds
    });

    return NextResponse.json(result);

  } catch (error) {
    console.error('M-Pesa API Error:', {
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack
      } : error,
      env: MPESA_ENV,
      nodeEnv: process.env.NODE_ENV,
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