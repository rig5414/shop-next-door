import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { OrderStatus, TransactionStatus } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const callbackData = await req.json();
    
    const resultCode = callbackData.Body.stkCallback.ResultCode;
    const orderRef = callbackData.Body.stkCallback.CallbackMetadata?.Item?.find(
      (item: any) => item.Name === "AccountReference"
    )?.Value;

    const orderId = orderRef?.replace('Order-', '');

    if (!orderId) {
      throw new Error('Order ID not found in callback data');
    }

    // Use transaction to update both order and transaction
    await prisma.$transaction(async (tx) => {
      // Update transaction status
      await tx.transaction.update({
        where: { orderId },
        data: {
          status: resultCode === 0 
            ? "successful" as TransactionStatus 
            : "failed" as TransactionStatus,
        },
      });

      // Update order status based on payment result
      await tx.order.update({
        where: { id: orderId },
        data: { 
          status: resultCode === 0 
            ? "shipped" as OrderStatus 
            : "cancelled" as OrderStatus 
        },
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('M-Pesa Callback Error:', error);
    return NextResponse.json(
      { error: "Failed to process callback" },
      { status: 500 }
    );
  }
}