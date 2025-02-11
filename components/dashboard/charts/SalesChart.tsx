"use client";

import { Chart } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
} from "chart.js";
import { useEffect, useState } from "react";

// Register Chart.js components
ChartJS.register(BarElement, LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

const SalesChart = ({ className= "" }) => {
  const [timeframe, setTimeframe] = useState("weekly");
  const [salesData, setSalesData] = useState({
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        type: "bar" as const, // ✅ Explicitly set type to "bar"
        label: "Sales ($)",
        data: [250, 420, 380, 600, 750, 900, 1200],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        type: "line" as const, // ✅ Explicitly set type to "line"
        label: "Trend",
        data: [200, 400, 350, 580, 700, 850, 1100],
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 2,
        fill: false,
      },
    ],
  });

  useEffect(() => {
    if (timeframe === "daily") {
      setSalesData({
        labels: ["00:00", "06:00", "12:00", "18:00", "23:59"],
        datasets: [
          {
            type: "bar" as const,
            label: "Sales ($)",
            data: [20, 50, 100, 150, 200],
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
          {
            type: "line" as const,
            label: "Trend",
            data: [15, 45, 90, 140, 190],
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 2,
            fill: false,
          },
        ],
      });
    } else if (timeframe === "monthly") {
      setSalesData({
        labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
        datasets: [
          {
            type: "bar" as const,
            label: "Sales ($)",
            data: [3200, 4500, 5000, 6200],
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
          {
            type: "line" as const,
            label: "Trend",
            data: [3000, 4300, 4700, 6000],
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 2,
            fill: false,
          },
        ],
      });
    } else {
      setSalesData({
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [
          {
            type: "bar" as const,
            label: "Sales ($)",
            data: [250, 420, 380, 600, 750, 900, 1200],
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
          {
            type: "line" as const,
            label: "Trend",
            data: [200, 400, 350, 580, 700, 850, 1100],
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 2,
            fill: false,
          },
        ],
      });
    }
  }, [timeframe]);

  return (
    <div className={`bg-gray-800 p-4 rounded-lg shadow-md cursor-pointer hover:opacity-80 transition-opacity${className}`}>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-white text-xl font-semibold">Sales Insights</h2>
        <label htmlFor="timeframe" className="sr-only">
          Select Timeframe
        </label>
        <select
          id="timeframe"
          className="p-2 bg-gray-700 text-white rounded-md"
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
        >
          <option value="daily">Daily Report</option>
          <option value="weekly">Weekly Report</option>
          <option value="monthly">Monthly Report</option>
        </select>
      </div>
      <Chart type="bar" data={salesData} />
    </div>
  );
};

export default SalesChart;
