import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

// Allowed payment methods
const ALLOWED_METHODS = ["mpesa", "airtel", "cod"];

// POST: Create a new payment
export async function POST(req: Request) {
  try {
    const { orderId, customerId, amount, method, phoneNumber } = await req.json();

    // Validate input
    if (!orderId || !customerId || !amount || !method) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    if (!ALLOWED_METHODS.includes(method)) {
      return NextResponse.json({ error: "Invalid payment method" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // If method is COD, mark as successful instantly
    const status = method === "cod" ? "successful" : "pending";

    const transaction = await prisma.transaction.create({
      data: {
        orderId,
        customerId,
        amount,
        method,
        phoneNumber: method !== "cod" ? phoneNumber : null,
        status,
      },
    });

    // If COD, update order status immediately
    if (method === "cod") {
      await prisma.order.update({
        where: { id: orderId },
        data: { status: "completed" },
      });
    }

    return NextResponse.json({ transactionId: transaction.id, status }, { status: 201 });
  } catch (error) {
    console.error("Payment processing failed:", error);
    return NextResponse.json(
      { error: "Failed to process payment", details: (error as Error).message },
      { status: 500 }
    );
  }
}


// GET: Fetch a payment status
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const transactionId = searchParams.get("transactionId");

    if (!transactionId) return NextResponse.json({ error: "Transaction ID required" }, { status: 400 });

    const transaction = await prisma.transaction.findUnique({ where: { id: transactionId } });

    if (!transaction) return NextResponse.json({ error: "Transaction not found" }, { status: 404 });

    return NextResponse.json(transaction);
  } catch (error) {
    console.error("Error fetching transaction:", error);
    return NextResponse.json({ error: "Failed to retrieve transaction" }, { status: 500 });
  }
}

// PATCH: Update payment status (e.g., from external callback)
export async function PATCH(req: Request) {
  try {
    const { transactionId, status } = await req.json();

    if (!transactionId || !["successful", "failed"].includes(status)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const transaction = await prisma.transaction.update({
      where: { id: transactionId },
      data: { status },
    });

    if (status === "successful") {
      await prisma.order.update({
        where: { id: transaction.orderId },
        data: { status: "completed" },
      });
    }

    return NextResponse.json({ transactionId, status });
  } catch (error) {
    console.error("Failed to update transaction:", error);
    return NextResponse.json({ error: "Failed to update payment" }, { status: 500 });
  }
}
