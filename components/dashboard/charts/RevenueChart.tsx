"use client";

import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useState } from "react";
import { useRouter } from "next/navigation";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const RevenueChart = ({ className= "" }) => {
  const router = useRouter();

  const [chartData] = useState({
    labels: ["Electronics", "Clothing", "Groceries", "Accessories", "Others"],
    datasets: [
      {
        label: "Revenue ($)",
        data: [5000, 4200, 3500, 2800, 1500],
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
        hoverOffset: 10,
      },
    ],
  });

  return (
    <div
      className={`bg-gray-800 p-4 rounded-lg shadow-md cursor-pointer hover:opacity-80 transition-opacity ${className}`}
      onClick={() => router.push("/analytics/revenue")}
    >
      <h2 className="text-white text-xl font-semibold mb-3">Revenue Breakdown</h2>
      <Doughnut data={chartData} />
      <p className="text-blue-400 text-sm mt-2 text-center">Click to view full report</p>
    </div>
  );
};

export default RevenueChart;
