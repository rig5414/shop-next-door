import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    // 1️⃣ **Total Sales (Aggregated by Day)**
    const sales = await prisma.order.findMany({
      orderBy: { createdAt: "asc" },
      select: {
        createdAt: true,
        total: true,
      },
    });

    const dailySales: { [date: string]: number } = {}; // Use an object to store daily totals

    sales.forEach((sale) => {
      const date = sale.createdAt.toISOString().split("T")[0]; // Get YYYY-MM-DD
      if (dailySales[date]) {
        dailySales[date] += sale.total.toNumber(); // Add to existing total
      } else {
        dailySales[date] = sale.total.toNumber(); // Start new total for the day
      }
    });

    const salesData = Object.entries(dailySales).map(([date, total]) => ({
      date,
      total,
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
          select: { catalog: { select: { name: true } } },
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
      sales: salesData, // Use the aggregated sales data
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