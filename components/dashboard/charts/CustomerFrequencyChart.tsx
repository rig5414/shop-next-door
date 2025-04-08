"use client";

import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useRouter } from "next/navigation";
import { fetchInsights } from "../../../lib/fetchInsights";

const BAR_COLOR = "rgba(54, 162, 235, 0.6)";

interface CustomerFrequencyData {
    customer: string; // Changed from 'day' to 'customer'
    ordersPlaced: number; // Changed from 'customers' to 'ordersPlaced'
}

export default function CustomerFrequencyChart({ className = "" }) {
    const router = useRouter();
    const [data, setData] = useState<CustomerFrequencyData[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const insights = await fetchInsights();
                console.log("Insights:", insights);

                if (insights && insights.customers) { // Changed to insights.customers
                    // Map the data to the correct format
                    const mappedData: CustomerFrequencyData[] = insights.customers.map((customer: any) => ({
                        customer: customer.customer, // Use customer name
                        ordersPlaced: customer.ordersPlaced, // Use ordersPlaced count
                    }));
                    setData(mappedData);
                    console.log("Customer Frequency Data:", mappedData);
                } else {
                    console.error("No customer data found in insights"); // Changed error message
                }
            } catch (error) {
                console.error("Error fetching customer frequency data:", error);
            }
        }

        fetchData();
    }, []);

    return (
        <div
            className={`bg-gray-800 p-4 rounded-lg shadow-md cursor-pointer hover:opacity-80 transition-opacity ${className}`}
        >
            <h2 className="text-white text-xl font-semibold mb-3">Customer Purchase Frequency</h2>

            {data?.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="customer" stroke="#ffffff" /> {/* Changed dataKey to "customer" */}
                        <YAxis stroke="#ffffff" />
                        <Tooltip />
                        <Bar dataKey="ordersPlaced" fill={BAR_COLOR} /> {/* Changed dataKey to "ordersPlaced" */}
                    </BarChart>
                </ResponsiveContainer>
            ) : (
                <p className="text-gray-400 text-sm text-center">Loading...</p>
            )}
        </div>
    );
}

