"use client";

import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from "chart.js";
import { useState } from "react";
import { useRouter } from "next/navigation";

// Register Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const CustomerFrequencyChart = ({ className = "" }) => {
  const router = useRouter();

  const [chartData] = useState({
    labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    datasets: [
      {
        label: "Customers",
        data: [50, 75, 60, 90, 110],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  });

  return (
    <div
      className={`bg-gray-800 p-4 rounded-lg shadow-md cursor-pointer hover:opacity-80 transition-opacity ${className}`}
      onClick={() => router.push("/analytics/customers")}
    >
      <h2 className="text-white text-xl font-semibold mb-3">Customer Purchase Frequency</h2>
      <Bar data={chartData} />
    </div>
  );
};

export default CustomerFrequencyChart;
