import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { OrderStatus, TransactionStatus, PaymentMethod } from "@prisma/client";

// Environment variables
const MPESA_CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY!;
const MPESA_CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET!;
const MPESA_PASSKEY = process.env.MPESA_PASSKEY!;
const MPESA_SHORTCODE = process.env.MPESA_SHORTCODE!;
const MPESA_ENV = process.env.MPESA_ENV || 'sandbox';

// API URLs based on environment
const MPESA_AUTH_URL = MPESA_ENV === 'sandbox' 
  ? 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'
  : 'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';

const MPESA_STK_URL = MPESA_ENV === 'sandbox'
  ? 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest'
  : 'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest';

// Helper function to get base URL
const getBaseUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    // For local development, use ngrok URL if available
    if (process.env.NGROK_URL) {
      return process.env.NGROK_URL;
    }
    console.warn('Warning: Using localhost for M-Pesa callback may not work');
    return 'http://localhost:3000';
  }
  
  // For production
  const productionUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if (!productionUrl) {
    throw new Error('NEXT_PUBLIC_BASE_URL not configured for production');
  }
  return productionUrl;
};

// Phone number formatting helper
const formatPhoneNumber = (phoneNumber: string): string => {
  let cleaned = phoneNumber.replace(/\D/g, '');
  
  if (cleaned.startsWith('0')) {
    cleaned = '254' + cleaned.slice(1);
  }
  
  if (cleaned.startsWith('+')) {
    cleaned = cleaned.slice(1);
  }
  
  if (!cleaned.startsWith('254')) {
    cleaned = '254' + cleaned;
  }
  
  return cleaned;
};

// Configuration validation
const validateConfig = () => {
  const baseUrl = getBaseUrl();
  
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

// Access token generation
async function getAccessToken(): Promise<string> {
  const auth = Buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`).toString('base64');
  
  try {
    const response = await fetch(MPESA_AUTH_URL, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
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

// Main POST handler
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

    const formattedPhone = formatPhoneNumber(phoneNumber);
    
    if (!/^254(7|1)\d{8}$/.test(formattedPhone)) {
      return NextResponse.json(
        { error: "Invalid Safaricom phone number" },
        { status: 400 }
      );
    }

    const accessToken = await getAccessToken();
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    const password = Buffer.from(
      `${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`
    ).toString('base64');

    // Log STK push request details
    console.log('STK Push Request:', {
      phoneNumber: formattedPhone,
      amount: Math.round(Number(amount)),
      orderId,
      timestamp,
      callbackUrl: `${getBaseUrl()}/api/mpesa/callback`
    });

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
        AccountReference: `${orderId.slice(0, 12)}`,
        TransactionDesc: `Payment`
      }),
    });

    // Log raw response for debugging
    const responseText = await stkResponse.text();
    console.log('STK Response Status:', stkResponse.status);
    console.log('STK Raw Response:', responseText);

    let mpesaResponse;
    try {
      mpesaResponse = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse STK response:', responseText);
      throw new Error('Invalid response from M-Pesa');
    }

    // Database transaction
    const result = await prisma.$transaction(async (tx) => {
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
      timeout: 10000
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