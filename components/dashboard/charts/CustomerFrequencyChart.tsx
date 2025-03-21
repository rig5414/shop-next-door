"use client";

import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useRouter } from "next/navigation";
import { fetchInsights } from "../../../lib/fetchInsights";

const BAR_COLOR = "rgba(54, 162, 235, 0.6)";

export default function CustomerFrequencyChart({ className = "" }) {
    const router = useRouter();
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const insights = await fetchInsights();
                console.log("Insights:", insights); // Log the insights object

                if (insights && insights?.customerFrequency) {
                    setData(insights?.customerFrequency);
                    console.log("Customer Frequency Data:", insights.customerFrequency); // Log the data
                } else {
                    console.error("No customerFrequency data found in insights");
                }
            } catch (error) {
                console.error("Error fetching customer frequency data:", error);
            }
        }

        fetchData();
    }, []);

    if (data?.length > 0) {
        console.log("Data State:", data); // Log the data state
    }

    return (
        <div
            className={`bg-gray-800 p-4 rounded-lg shadow-md cursor-pointer hover:opacity-80 transition-opacity ${className}`}
            onClick={() => router.push("/analytics/customers")}
        >
            <h2 className="text-white text-xl font-semibold mb-3">Customer Purchase Frequency</h2>

            {data?.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data?data:[]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" stroke="#ffffff" />
                        <YAxis stroke="#ffffff" />
                        <Tooltip />
                        <Bar dataKey="customers" fill={BAR_COLOR} />
                    </BarChart>
                </ResponsiveContainer>
            ) : (
                <p className="text-gray-400 text-sm text-center">Loading...</p>
            )}
        </div>
    );
}