import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    // 1️⃣ **Total Sales per Month** (Sum of all order values)
    const sales = await prisma.order.groupBy({
      by: ["createdAt"],
      _sum: { total: true },
      _count: { id: true }, // Count total orders
      orderBy: { createdAt: "desc" },
    });

    const salesData = sales.map((s) => ({
      month: new Date(s.createdAt).toLocaleString("en-US", { month: "short" }),
      total: s._sum?.total?.toNumber() ?? 0,
      orderCount: s._count.id,
    }));

    // 2️⃣ **Best-Selling Products** (Top 5 products)
    const bestSelling = await prisma.orderItem.groupBy({
      by: ["productId"],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    });

    const bestSellingData = await Promise.all(
      bestSelling.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: { catalog: { select: { name: true } } }, // Directly get catalog name
        });

        return {
          product: product?.catalog.name || "Unknown",
          quantitySold: item._sum?.quantity ?? 0,
        };
      })
    );

    // 3️⃣ **Revenue Breakdown by Month** (Sum of transaction amounts)
    const revenue = await prisma.transaction.groupBy({
      by: ["createdAt"],
      _sum: { amount: true },
      orderBy: { createdAt: "asc" },
    });

    const revenueData = revenue.map((r) => ({
      month: new Date(r.createdAt).toLocaleString("en-US", { month: "short" }),
      revenue: r._sum?.amount?.toNumber() ?? 0,
    }));

    // 4️⃣ **Order Status Breakdown** (Count orders per status)
    const orderStats = await prisma.order.groupBy({
      by: ["status"],
      _count: { status: true },
    });

    const orderData = orderStats.map((o) => ({
      status: o.status,
      count: o._count.status,
    }));

    // 5️⃣ **Customer Purchase Frequency** (Top 5 active customers)
    const customerFrequency = await prisma.order.groupBy({
      by: ["customerId"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 5,
    });

    const customerData = await Promise.all(
      customerFrequency.map(async (customer) => {
        const user = await prisma.user.findUnique({
          where: { id: customer.customerId },
          select: { name: true },
        });
        return {
          customer: user?.name || "Unknown",
          ordersPlaced: customer._count.id,
        };
      })
    );

    // Final JSON Response
    return NextResponse.json({
      sales: salesData,
      bestSelling: bestSellingData,
      revenue: revenueData,
      orders: orderData,
      customers: customerData,
    });
  } catch (error) {
    console.error("Error fetching insights:", error);
    return NextResponse.json({ error: "Failed to fetch insights" }, { status: 500 });
  }
}
