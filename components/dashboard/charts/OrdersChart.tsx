"use client";

import React, { useState, useEffect } from "react";
import Spinner from "../../ui/Spinner";
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
                    const completedCount = insights.orders.find((o: any) => o.status === 'completed')?.count || 0;
                    const pendingCount = insights.orders.find((o: any) => o.status === 'pending')?.count || 0;

                    const chartData: OrdersData[] = [
                        {
                            status: "Orders",
                            completed: completedCount,
                            pending: pendingCount,
                        },
                    ];
                    setData(chartData);
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
        <div className="bg-gray-800 p-4 rounded-lg shadow-md w-full h-full flex flex-col">
            <h2 className="text-white text-xl font-semibold mb-3">Completed vs. Pending Orders</h2>
            <div className="flex-1 min-h-[300px]">
                {data.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis 
                                dataKey="status" 
                                stroke="#ffffff" 
                                tick={{ fill: '#ffffff' }}
                            />
                            <YAxis 
                                stroke="#ffffff"
                                tick={{ fill: '#ffffff' }}
                            />
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: '#1f2937',
                                    border: '1px solid #374151',
                                    borderRadius: '0.375rem'
                                }}
                                labelStyle={{ color: '#ffffff' }}
                            />
                            <Legend 
                                wrapperStyle={{ 
                                    paddingTop: '20px',
                                    width: '100%',
                                    color: '#ffffff'
                                }}
                            />
                            <Bar 
                                dataKey="completed" 
                                fill={COMPLETED_COLOR} 
                                name="Completed Orders"
                                radius={[4, 4, 0, 0]}
                            />
                            <Bar 
                                dataKey="pending" 
                                fill={PENDING_COLOR} 
                                name="Pending Orders"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-400 text-sm">Loading...</p>
                        <Spinner/>
                    </div>
                )}
            </div>
        </div>
    );
}

