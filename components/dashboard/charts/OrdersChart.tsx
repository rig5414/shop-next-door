"use client";

import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { useRouter } from "next/navigation";
import { fetchInsights } from "../../../lib/fetchInsights";

const COMPLETED_COLOR = "rgba(75, 192, 192, 0.6)";
const PENDING_COLOR = "rgba(255, 159, 64, 0.6)";

interface OrdersData {
    status: string;
    completed: number;
    pending: number;
}

export default function OrdersChart({ className = "" }) {
    const router = useRouter();
    const [data, setData] = useState<OrdersData[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const insights = await fetchInsights();
                console.log("Insights:", insights);

                if (insights && insights.orders) {
                    // Assuming insights.orders is an object with completed and pending counts
                    const completedCount = insights.orders.find((o: any) => o.status === 'completed')?.count || 0;
                    const pendingCount = insights.orders.find((o: any) => o.status === 'pending')?.count || 0;

                    const chartData: OrdersData[] = [
                        {
                            status: "Orders", // Label for the X-axis
                            completed: completedCount,
                            pending: pendingCount,
                        },
                    ];
                    setData(chartData);

                    console.log("Orders Data:", chartData);
                } else {
                    console.error("No orders data found in insights");
                }
            } catch (error) {
                console.error("Error fetching orders data:", error);
            }
        }

        fetchData();
    }, []);

    return (
        <div
            className={`bg-gray-800 p-4 rounded-lg shadow-md cursor-pointer hover:opacity-80 transition-opacity ${className}`}
        >
            <h2 className="text-white text-xl font-semibold mb-3">Completed vs. Pending Orders</h2>

            {data.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="status" stroke="#ffffff" />
                        <YAxis stroke="#ffffff" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="completed" fill={COMPLETED_COLOR} name="Completed Orders" />
                        <Bar dataKey="pending" fill={PENDING_COLOR} name="Pending Orders" />
                    </BarChart>
                </ResponsiveContainer>
            ) : (
                <p className="text-gray-400 text-sm text-center">Loading...</p>
            )}
        </div>
    );
}

