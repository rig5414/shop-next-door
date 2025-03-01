"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useRouter } from "next/navigation";
import { fetchInsights } from "../../../lib/fetchInsights";

const COLORS = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"];

const RevenueChart = ({ className = "" }) => {
  const router = useRouter();
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const insights = await fetchInsights();
        if (insights?.revenueBreakdown) {
          const formattedData = Object.entries(insights.revenueBreakdown).map(([category, value], index) => ({
            name: category,
            value,
            color: COLORS[index % COLORS.length], // Assign colors dynamically
          }));
          setChartData(formattedData);
        }
      } catch (error) {
        console.error("Error fetching revenue data:", error);
      }
    };

    fetchData();
  }, []);

  if (chartData.length === 0) {
    return <div className="text-white">Loading revenue data...</div>;
  }

  return (
    <div
      className={`bg-gray-800 p-4 rounded-lg shadow-md cursor-pointer hover:opacity-80 transition-opacity ${className}`}
      onClick={() => router.push("/analytics/revenue")}
    >
      <h2 className="text-white text-xl font-semibold mb-3">Revenue Breakdown</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <p className="text-blue-400 text-sm mt-2 text-center">Click to view full report</p>
    </div>
  );
};

export default RevenueChart;
