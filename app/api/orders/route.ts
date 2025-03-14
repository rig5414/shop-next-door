import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { OrderStatus } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

// Define Item type
type Item = {
  productId: string;
  quantity: number;
  price: string | number;
};

// Utility function to ensure price is always a Decimal
const parsePrice = (price: string | number): Decimal => {
  try {
    return new Decimal(price);
  } catch (error) {
    console.error(`Invalid price detected: ${price}`);
    throw new Error("Invalid price format");
  }
};

// GET all orders with optional filters
export async function GET(req: Request) {
  try {
      const { searchParams } = new URL(req.url);
      const customerId = searchParams.get("customerId");
      const vendorId = searchParams.get("vendorId");
      const shopId = searchParams.get("shopId");

      let whereClause: any = {};

      if (customerId) whereClause.customerId = customerId;
      if (vendorId) {
          const shops = await prisma.shop.findMany({
              where: { vendorId },
              select: { id: true },
          });
          whereClause.shopId = { in: shops.map((s) => s.id) };
      }
      if (shopId) whereClause.shopId = shopId;

      const orders = await prisma.order.findMany({
          where: whereClause,
          select: {
              id: true,
              customerId: true,
              shopId: true,
              total: true,
              status: true,
              createdAt: true,
              updatedAt: true,
              customer: { select: { id: true, name: true, email: true } },
              shop: { select: { id: true, name: true } },
              items: true,
              transaction: true,
          },
      });

      if (orders.length === 0) {
          console.log("No orders found, returning empty array");
          return NextResponse.json([]); // Return an empty array here
      }

      console.log("Orders found, returning orders");
      return NextResponse.json(orders, { status: 200 });
  } catch (error) {
      console.error("Error fetching orders:", error);
      return NextResponse.json({ error: "Error fetching orders" }, { status: 500 });
  }
}

// POST create a new order
export async function POST(req: Request) {
  try {
    const { customerId, shopId, items }: { customerId: string; shopId: string; items: Item[] } = await req.json();

    if (!customerId || !shopId || !items?.length) {
      return NextResponse.json({ error: "Invalid order data" }, { status: 400 });
    }

    const shop = await prisma.shop.findUnique({ where: { id: shopId } });
    if (!shop) return NextResponse.json({ error: "Shop not found" }, { status: 404 });

    const productIds = items.map((item) => item.productId);
    const products = await prisma.product.findMany({ where: { id: { in: productIds }, shopId } });

    const stockIssues = items.filter((item) => {
      const product = products.find((p) => p.id === item.productId);
      return !product || product.stock < item.quantity;
    });

    if (stockIssues.length) return NextResponse.json({ error: "Insufficient stock for some items" }, { status: 400 });

    const total = items.reduce((sum, item) => sum.plus(parsePrice(item.price).times(item.quantity)), new Decimal(0));

    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          customerId,
          shopId,
          total,
          status: "pending",
          items: { create: items.map((item) => ({ productId: item.productId, quantity: item.quantity, price: parsePrice(item.price) })) },
        },
        include: { items: true },
      });

      await Promise.all(
        items.map((item) => tx.product.update({ where: { id: item.productId }, data: { stock: { decrement: item.quantity } } }))
      );

      await tx.transaction.create({ data: { orderId: order.id, customerId: order.customerId, status: "successful", amount: total } });

      return order;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Order creation failed:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

// PUT update order status
export async function PUT(req: Request) {
  try {
    const { id, status, vendorId, items }: { id: string; status: string; vendorId?: string; items?: Item[] } = await req.json();

    if (!id || !status) return NextResponse.json({ error: "Invalid data" }, { status: 400 });

    if (!["pending", "shipped", "completed", "cancelled"].includes(status)) {
      return NextResponse.json({ error: "Invalid order status" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({ where: { id }, include: { shop: true, items: true } });

    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    if (vendorId && order.shop?.vendorId !== vendorId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await prisma.$transaction(async (tx) => {
      if (items?.length) {
        const removedItems = order.items.filter((existingItem) => !items.find((newItem) => newItem.productId === existingItem.productId));

        await Promise.all(
          removedItems.map((item) => tx.product.update({ where: { id: item.productId }, data: { stock: { increment: item.quantity } } }))
        );

        await Promise.all(
          items.map((item) => tx.product.update({ where: { id: item.productId }, data: { stock: { decrement: item.quantity } } }))
        );

        await tx.orderItem.deleteMany({ where: { orderId: id } });
        await tx.orderItem.createMany({
          data: items.map((item) => ({ orderId: id, productId: item.productId, quantity: item.quantity, price: parsePrice(item.price) })),
        });

        const total = items.reduce((sum, item) => sum.plus(parsePrice(item.price).times(item.quantity)), new Decimal(0));

        await tx.order.update({ where: { id }, data: { status: status as OrderStatus, total } });
      } else {
        await tx.order.update({ where: { id }, data: { status: status as OrderStatus } });
      }
    });

    return NextResponse.json({ message: "Order updated successfully" });
  } catch (error) {
    console.error("Order update failed:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}

// DELETE order (Only admins)
export async function DELETE(req: Request) {
  try {
    const { id, role }: { id: string; role: string } = await req.json();

    if (!id) return NextResponse.json({ error: "Order ID required" }, { status: 400 });

    if (role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const order = await prisma.order.findUnique({ where: { id }, include: { items: true } });

    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    await prisma.$transaction(async (tx) => {
      await Promise.all(order.items.map((item) => tx.product.update({ where: { id: item.productId }, data: { stock: { increment: item.quantity } } })));

      await tx.orderItem.deleteMany({ where: { orderId: id } });
      await tx.transaction.deleteMany({ where: { orderId: id } });
      await tx.order.delete({ where: { id } });
    });

    return NextResponse.json({ message: "Order deleted successfully, stock restored" });
  } catch (error) {
    console.error("Order deletion failed:", error);
    return NextResponse.json({ error: "Failed to delete order" }, { status: 500 });
  }
}
