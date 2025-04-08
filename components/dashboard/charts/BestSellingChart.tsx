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

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white border border-gray-300 rounded-md p-2 shadow-md">
                <p className="text-gray-800">{`Product: ${payload[0].payload.product}`}</p>
                <p className="text-gray-800">{`Quantity Sold: ${payload[0].payload.quantitySold}`}</p>
                <p className="text-gray-800">{`Percentage: ${payload[0].payload.percentage.toFixed(2)}%`}</p>
            </div>
        );
    }

    return null;
};

interface BestSellingData {
    product: string;
    quantitySold: number;
    percentage?: number; // Make percentage optional
}

export default function BestSellingChart({ className = "" }) {
    const router = useRouter();
    const [data, setData] = useState<BestSellingData[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const insights = await fetchInsights();
                if (insights && insights.bestSelling) {
                    // Calculate total quantity for percentage calculation
                    const totalQuantity = insights.bestSelling.reduce(
                        (sum: number, item: { quantitySold: number }) => sum + item.quantitySold,
                        0
                    );

                    // Add percentage to each data item
                    const enrichedData: BestSellingData[] = insights.bestSelling.map(
                        (item: { product: string, quantitySold: number }) => ({
                            product: item.product,
                            quantitySold: item.quantitySold,
                            percentage: (item.quantitySold / totalQuantity) * 100,
                        })
                    );
                    setData(enrichedData);
                    console.log("Fetched data:", enrichedData);
                } else {
                    console.error("No bestSelling data found in insights");
                }
            } catch (error) {
                console.error("Error fetching best-selling products:", error);
            }
        }

        fetchData();
    }, []);

    return (
        <div
            className={`bg-gray-800 p-4 rounded-lg shadow-md cursor-pointer hover:opacity-80 transition-opacity ${className}`}
        >
            <h2 className="text-white text-xl font-semibold mb-3">Best Selling Products</h2>

            {data.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="quantitySold"
                            nameKey="product"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            innerRadius={70}
                            fill="#8884d8"
                            labelLine={false}
                            label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                                const RADIAN = Math.PI / 180;
                                const radius = innerRadius + (outerRadius - innerRadius) * 1.1;
                                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                const y = cy + radius * Math.sin(-midAngle * RADIAN);

                                const textX = x > cx ? x + 10 : x - 10;
                                const textAnchor = x > cx ? "start" : "end";

                                return (
                                    <g>
                                        <line
                                            x1={x}
                                            y1={y}
                                            x2={textX}
                                            y2={y}
                                            stroke={COLORS[index % COLORS.length]}
                                        />
                                        <text
                                            x={textX}
                                            y={y}
                                            textAnchor={textAnchor}
                                            fill="#fff"
                                            fontSize="14px"
                                            dy=".35em"
                                        >
                                            {data[index].product}
                                        </text>
                                    </g>
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
                <p className="text-gray-400 text-sm text-center">Loading...</p>
            )}
        </div>
    );
}

