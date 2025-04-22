import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Initialize empty whereClause
        const whereClause = {};

        // Fetch all orders
        const orders = await prisma.order.findMany({
            include: {
                items: {
                    select: {
                        price: true,
                        quantity: true
                    }
                }
            },
            orderBy: {
                createdAt: 'asc'
            }
        });

        console.log(`Found ${orders.length} orders`); // Debug log

        // Process orders into monthly data
        const monthlyData = new Map();

        orders.forEach(order => {
            const date = new Date(order.createdAt);
            const monthKey = date.toLocaleString('en-US', { 
                month: 'short', 
                year: 'numeric' 
            });

            const orderTotal = order.items.reduce((sum, item) => 
                sum + (Number(item.price) * item.quantity), 0);

            if (!monthlyData.has(monthKey)) {
                monthlyData.set(monthKey, {
                    total: 0,
                    completed: 0,
                    count: 0,
                    completedCount: 0
                });
            }

            const monthData = monthlyData.get(monthKey);
            monthData.total += orderTotal;
            monthData.count += 1;

            if (order.status.toLowerCase() === 'completed') {
                monthData.completed += orderTotal;
                monthData.completedCount += 1;
            }
        });

        // Convert to array and calculate completion rates
        const salesData = Array.from(monthlyData.entries()).map(([date, data]) => ({
            date,
            total: Number(data.total.toFixed(2)),
            completed: Number(data.completed.toFixed(2)),
            completionRate: data.count > 0 
                ? Number(((data.completedCount / data.count) * 100).toFixed(1))
                : 0
        }));

        // Best-Selling Products (Top 5)
        const bestSelling = await prisma.orderItem.groupBy({
            by: ["productId"],
            where: whereClause,
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

        // Revenue Breakdown
        const revenue = await prisma.order.groupBy({
            by: ['createdAt'],
            where: whereClause,
            _sum: {
                total: true
            },
            orderBy: {
                createdAt: 'asc'
            }
        });

        // Process revenue data to group by month
        const monthlyRevenue = new Map();

        revenue.forEach((r) => {
            const monthKey = new Date(r.createdAt).toLocaleString('en-US', {
                month: 'short',
                year: 'numeric'
            });

            const total = Number(r._sum.total?.toFixed(2)) || 0;
            monthlyRevenue.set(monthKey, (monthlyRevenue.get(monthKey) || 0) + total);
        });

        const revenueData = Array.from(monthlyRevenue.entries()).map(([month, total]) => ({
            month,
            _sum: {
                total: Number(total.toFixed(2))
            }
        }));

        // Order Status Breakdown
        const orderStats = await prisma.order.groupBy({
            by: ["status"],
            where: whereClause,
            _count: { status: true },
        });

        const orderData = orderStats.map((o) => ({
            status: o.status,
            count: o._count.status,
        }));

        // Customer Purchase Frequency
        const customerFrequency = await prisma.order.groupBy({
            by: ["customerId"],
            where: whereClause,
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

        // Return all data
        return NextResponse.json({
            sales: salesData,
            bestSelling: bestSellingData,
            revenue: revenueData,
            orders: orderData,
            customers: customerData,
        });

    } catch (error) {
        console.error("Error in insights route:", error);
        return NextResponse.json(
            { error: "Failed to fetch insights" },
            { status: 500 }
        );
    }
}