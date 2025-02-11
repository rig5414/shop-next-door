"use client";

import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from "chart.js";
import { useState } from "react";
import { useRouter } from "next/navigation";

// Register Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const OrdersChart = ({ className = "" }) => {
  const router = useRouter();

  const [chartData] = useState({
    labels: ["Orders"],
    datasets: [
      {
        label: "Completed",
        data: [120],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "Pending",
        data: [30],
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  });

  return (
    <div
      className={`bg-gray-800 p-4 rounded-lg shadow-md cursor-pointer hover:opacity-80 transition-opacity ${className}`}
      onClick={() => router.push("/analytics/orders")}
    >
      <h2 className="text-white text-xl font-semibold mb-3">Pending vs. Completed Orders</h2>
      <Bar data={chartData} />
    </div>
  );
};

export default OrdersChart;
