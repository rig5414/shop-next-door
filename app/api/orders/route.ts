import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

// GET all orders or filter by customerId
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const customerId = searchParams.get("customerId");

    const whereClause = customerId ? { customerId } : {};

    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        items: true,
        customer: { select: { id: true, name: true, email: true } },
        shop: { select: { id: true, name: true } },
        transaction: true,
      },
    });

    // Convert Decimal total to a number before returning response
    const formattedOrders = orders.map(order => ({
      ...order,
      total: Number(order.total), // Ensure total is a number
    }));

    return NextResponse.json(formattedOrders);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching orders" }, { status: 500 });
  }
}

// POST create a new order (Only for customers)
export async function POST(req: Request) {
  try {
    const { customerId, shopId, items } = await req.json();

    if (!customerId || !shopId || !items || items.length === 0) {
      return NextResponse.json({ error: "Invalid order data" }, { status: 400 });
    }

    // Check if shop exists
    const shop = await prisma.shop.findUnique({ where: { id: shopId } });
    if (!shop) {
      return NextResponse.json({ error: "Shop not found" }, { status: 404 });
    }

    const total = items.reduce((sum: number, item: { price: number; quantity: number }) => 
      sum + item.price * item.quantity, 0);

    const order = await prisma.order.create({
      data: {
        customerId,
        shopId,
        total,
        status: "pending",
        items: {
          create: items.map((item: { productId: string; quantity: number; price: number }) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: { items: true },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

// PUT update order status (Admins & Vendors)
export async function PUT(req: Request) {
  try {
    const { id, status, vendorId } = await req.json();
    
    if (!id || !status) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id },
      include: { shop: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Check if vendor is authorized
    if (vendorId && (!order.shop || order.shop.vendorId !== vendorId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status },
      include: { items: true },
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}

// DELETE order (Only for admins)
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Order ID required" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    await prisma.orderItem.deleteMany({ where: { orderId: id } });
    await prisma.transaction.deleteMany({ where: { orderId: id } });
    await prisma.order.delete({ where: { id } });

    return NextResponse.json({ message: "Order deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete order" }, { status: 500 });
  }
}
