"use client";

import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useRouter } from "next/navigation";
import { fetchInsights } from "../../../lib/fetchInsights";

const COLORS = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"];

interface RevenueItem {
  createdAt: string;
  _sum: {
    total: number | null;
  };
  month: string;
}

interface RevenueData {
  name: string;
  value: number;
  color: string;
  percentage: number;
}

const cn = (...classes: string[]): string => {
  return classes.filter(Boolean).join(' ');
}

const RevenueChart = ({ className = "" }) => {
  const router = useRouter();
  const [chartData, setChartData] = useState<RevenueData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const insights = await fetchInsights();
        if (insights?.revenue) {
          const monthlyRevenue: Record<string, number> = {};

          insights.revenue.forEach((item: RevenueItem) => {
            const month =
              item.month ||
              new Date(item.createdAt).toLocaleString("en-US", {
                month: "short",
                year: "numeric",
              });

            const amount = item._sum.total === null ? 0 : Number(item._sum.total);
            monthlyRevenue[month] = (monthlyRevenue[month] || 0) + amount;
          });

          const totalRevenue = Object.values(monthlyRevenue).reduce(
            (sum, value) => sum + value,
            0
          );

          const formattedData: RevenueData[] = Object.entries(monthlyRevenue)
            .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
            .map(([month, total], index) => ({
              name: month,
              value: Number(total.toFixed(2)),
              color: COLORS[index % COLORS.length],
              percentage: totalRevenue > 0 ? (total / totalRevenue) * 100 : 0,
            }));

          setChartData(formattedData);
          setError(null);
        }
      } catch (error) {
        console.error("Error fetching revenue data:", error);
        setError("Failed to load revenue data");
      }
    };

    fetchData();
  }, []);

  const formatValue = (value: number) => `KSh ${value.toLocaleString()}`;

  if (error || chartData.length === 0) {
    return (
      <div className="bg-gray-800 p-4 rounded-lg shadow-md flex items-center justify-center h-[300px]">
        <p className="text-gray-400">{error ?? "Loading revenue data..."}</p>
        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;
  
    const { name, value, payload: data } = payload[0];
  
    return (
      <div className="bg-gray-900 text-white text-sm p-3 rounded shadow-lg border border-gray-700 min-w-[180px]">
        <p className="font-semibold mb-1">{name}</p>
        <p>
          Total Revenue: <span className="text-blue-400">KSh {value.toLocaleString()}</span>
        </p>
        <p>
          Share: <span className="text-yellow-400">{data.percentage?.toFixed(1) || 0}%</span>
        </p>
      </div>
    );
  };
  
  return (
    <div className={cn(
      "bg-gray-800 p-6 rounded-lg shadow-md w-full h-full",
      "hover:opacity-80 transition-opacity",
      className
  )}>

    <div className="w-full h-full flex flex-col">
      <h2 className="text-white text-xl font-semibold">
        Monthly Revenue Breakdown
      </h2>
      <div className="flex-1 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius="80%"
              innerRadius="55%"
              paddingAngle={2}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={1} />
              ))}
            </Pie>
            <Tooltip content={<CustomPieTooltip />} />
            <Legend
              layout="horizontal"
              align="center"
              verticalAlign="bottom"
              wrapperStyle={{ 
                paddingTop: '20px',
                width: '100%',
                fontSize: '12px'
              }}
              formatter={(value: string) => {
                const entry = chartData.find((d) => d.name === value);
                return entry ? `${value}: ${formatValue(entry.value)}` : value;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
    </div>
  );
};

export default RevenueChart;
