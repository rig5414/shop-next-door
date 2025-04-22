"use client";

import React, { useState, useEffect } from "react";
import Spinner from "../../ui/Spinner";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useRouter } from "next/navigation";
import { fetchInsights } from "../../../lib/fetchInsights";

const BAR_COLOR = "rgba(54, 162, 235, 0.6)";

interface CustomerFrequencyData {
    customer: string;
    ordersPlaced: number;
}

const cn = (...classes: string[]): string => {
    return classes.filter(Boolean).join(' ');
};

export default function CustomerFrequencyChart({ className = "" }) {
    const router = useRouter();
    const [data, setData] = useState<CustomerFrequencyData[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const insights = await fetchInsights();
                if (insights && insights.customers) {
                    const mappedData: CustomerFrequencyData[] = insights.customers.map((customer: any) => ({
                        customer: customer.customer,
                        ordersPlaced: customer.ordersPlaced,
                    }));
                    setData(mappedData);
                }
            } catch (error) {
                console.error("Error fetching customer frequency data:", error);
            }
        }
        fetchData();
    }, []);

    return (
        <div className={cn(
            "bg-gray-800 p-6 rounded-lg shadow-md w-full h-full",
            "hover:opacity-80 transition-opacity",
            className
        )}>
        <div className="w-full h-full flex flex-col">
            <h2 className="text-white text-xl font-semibold">Customer Purchase Frequency</h2>
            <div className="flex-1 min-h-[300px]">
                {data?.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart 
                            data={data}
                            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                        >
                            <CartesianGrid 
                                strokeDasharray="3 3" 
                                stroke="rgba(255,255,255,0.1)"
                            />
                            <XAxis 
                                dataKey="customer" 
                                stroke="#ffffff"
                                tick={{ fill: '#ffffff' }}
                                angle={-45}
                                textAnchor="end"
                                height={60}
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
                                cursor={{ fill: 'rgba(255,255,255,0.1)' }}
                            />
                            <Bar 
                                dataKey="ordersPlaced" 
                                fill={BAR_COLOR}
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
        </div>
    );
}

