"use client";

import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useRouter } from "next/navigation";
import { fetchInsights } from "../../../lib/fetchInsights";

const COLORS = [
    "#6F42C1", // Purple
    "#FF8C00", // Orange
    "#2A9D8F", // Teal
    "#E9C46A", // Gold
    "#F4A261", // Light orange
];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-gray-900 text-white text-sm p-3 rounded shadow-lg border border-gray-700">
                <p className="font-medium mb-1">{payload[0].payload.product}</p>
                <p className="text-gray-300">Quantity: {payload[0].payload.quantitySold}</p>
                <p className="text-gray-300">Share: {payload[0].payload.percentage.toFixed(2)}%</p>
            </div>
        );
    }
    return null;
};

interface BestSellingData {
    product: string;
    quantitySold: number;
    percentage?: number;
}

export default function BestSellingChart({ className = "" }) {
    const router = useRouter();
    const [data, setData] = useState<BestSellingData[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const insights = await fetchInsights();
                if (insights && insights.bestSelling) {
                    const totalQuantity = insights.bestSelling.reduce(
                        (sum: number, item: { quantitySold: number }) => sum + item.quantitySold,
                        0
                    );

                    const enrichedData: BestSellingData[] = insights.bestSelling.map(
                        (item: { product: string, quantitySold: number }) => ({
                            product: item.product,
                            quantitySold: item.quantitySold,
                            percentage: (item.quantitySold / totalQuantity) * 100,
                        })
                    );
                    setData(enrichedData);
                }
            } catch (error) {
                console.error("Error fetching best-selling products:", error);
            }
        }
        fetchData();
    }, []);

    return (
        <div className="bg-gray-800 p-4 rounded-lg shadow-md w-full h-full flex flex-col">
            <h2 className="text-white text-xl font-semibold mb-3">Best Selling Products</h2>
            <div className="flex-1 min-h-[300px]">
                {data.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                dataKey="quantitySold"
                                nameKey="product"
                                cx="50%"
                                cy="50%"
                                outerRadius="80%"
                                innerRadius="55%"
                                paddingAngle={2}
                                label={({ cx, cy, midAngle, innerRadius, outerRadius, product }) => {
                                    const RADIAN = Math.PI / 180;
                                    const radius = innerRadius + (outerRadius - innerRadius) * 1.1;
                                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                    const y = cy + radius * Math.sin(-midAngle * RADIAN);
                                    return (
                                        <text
                                            x={x}
                                            y={y}
                                            fill="#fff"
                                            textAnchor={x > cx ? 'start' : 'end'}
                                            dominantBaseline="central"
                                            fontSize="12px"
                                        >
                                            {product}
                                        </text>
                                    );
                                }}
                            >
                                {data.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-400 text-sm">Loading...</p>
                    </div>
                )}
            </div>
        </div>
    );
}

