"use client";

import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { useRouter } from "next/navigation";
import { fetchInsights } from "../../../lib/fetchInsights";

const COMPLETED_COLOR = "rgba(75, 192, 192, 0.6)";
const PENDING_COLOR = "rgba(255, 159, 64, 0.6)";

export default function OrdersChart({ className = "" }) {
    const router = useRouter();
    const [data, setData] = useState<{ status: string; completed: number; pending: number }[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const insights = await fetchInsights();
                console.log("Insights:", insights); // Log the insights object

                if (insights && insights.orders) {
                    setData([
                        {
                            status: "Orders",
                            completed: insights.orders.completed ?? 0,
                            pending: insights.orders.pending ?? 0,
                        },
                    ]);
                    console.log("Orders Data:", insights.orders); // Log the orders data
                } else {
                    console.error("No orders data found in insights");
                }
            } catch (error) {
                console.error("Error fetching orders data:", error);
            }
        }

        fetchData();
    }, []);

    if (data.length > 0) {
        console.log("Data State:", data); // Log the data state
    }

    return (
        <div
            className={`bg-gray-800 p-4 rounded-lg shadow-md cursor-pointer hover:opacity-80 transition-opacity ${className}`}
            onClick={() => router.push("/analytics/orders")}
        >
            <h2 className="text-white text-xl font-semibold mb-3">Pending vs. Completed Orders</h2>

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