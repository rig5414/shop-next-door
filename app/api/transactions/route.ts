import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

// GET ALL TRANSACTIONS
export async function GET(req: Request) {
  try {
    // Mocking user auth (replace with actual auth logic)
    const user = { id: "mockUserId", role: "admin" };

    if (user.role === "admin") {
      const transactions = await prisma.transaction.findMany({
        include: {
          order: {
            include: {
              customer: { select: { id: true, name: true, email: true } },
              shop: { select: { id: true, name: true } }
            }
          }
        }
      });
      return NextResponse.json(transactions);
    }

    if (user.role === "customer") {
      const transactions = await prisma.transaction.findMany({
        where: { customerId: user.id },
        include: {
          order: {
            include: {
              shop: { select: { id: true, name: true } }
            }
          }
        }
      });

      return NextResponse.json(transactions.length ? transactions : { message: "No transactions found." }, { status: transactions.length ? 200 : 404 });
    }

    if (user.role === "vendor") {
      const transactions = await prisma.transaction.findMany({
        where: { order: { shop: { vendorId: user.id } } },
        include: {
          order: {
            include: {
              customer: { select: { id: true, name: true, email: true } }
            }
          }
        }
      });

      return NextResponse.json(transactions.length ? transactions : { message: "No transactions found for vendor." }, { status: transactions.length ? 200 : 404 });
    }

    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch transactions", details: error }, { status: 500 });
  }
}

// CREATE TRANSACTION
export async function POST(req: Request) {
  try {
      const body = await req.json();
      const { orderId, amount, status } = body;

      if (!orderId || !amount || !status) {
          return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
      }

      const validStatuses = ["pending", "successful", "failed"];
      if (!validStatuses.includes(status)) {
          return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
      }
      if (amount <= 0) {
          return NextResponse.json({ error: "Amount must be greater than zero" }, { status: 400 });
      }

      const existingOrder = await prisma.order.findUnique({
          where: { id: orderId },
          select: { customerId: true },
      });

      if (!existingOrder) {
          return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      if (!existingOrder.customerId) {
          return NextResponse.json({ error: "Order has no associated customer" }, { status: 400 });
      }

      // Check if transaction already exists
      const existingTransaction = await prisma.transaction.findUnique({
          where: { orderId: orderId },
      });

      if (existingTransaction) {
          return NextResponse.json({ error: "Transaction already exists for this order" }, { status: 409 }); // Conflict status code
      }

      const newTransaction = await prisma.transaction.create({
          data: {
              orderId,
              customerId: existingOrder.customerId,
              amount,
              status,
          },
      });

      return NextResponse.json(newTransaction, { status: 201 });
  } catch (error: any) {
      console.error("Transaction creation error:", error);
      return NextResponse.json({ error: "Failed to create transaction", details: error.message }, { status: 500 });
  }
}

// UPDATE TRANSACTION STATUS
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "Missing transaction ID or status" }, { status: 400 });
    }

    // Validate transaction status
    const validStatuses = ["pending", "successful", "failed"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
    }

    // Mocking user auth (replace with actual auth logic)
    const user = { id: "mockUserId", role: "admin" };

    if (user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const transaction = await prisma.transaction.findUnique({ where: { id } });

    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    const updatedTransaction = await prisma.transaction.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(updatedTransaction, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update transaction", details: error }, { status: 500 });
  }
}

// DELETE TRANSACTION
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Transaction ID is required" }, { status: 400 });
    }

    // Mocking user auth (replace with actual auth logic)
    const user = { id: "mockUserId", role: "admin" };

    if (user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const transaction = await prisma.transaction.findUnique({ where: { id } });

    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    await prisma.transaction.delete({ where: { id } });

    return NextResponse.json({ message: "Transaction deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete transaction", details: error }, { status: 500 });
  }
}
