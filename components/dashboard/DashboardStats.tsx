import React from "react";

interface DashboardStatsProps {
  title: string;
  value: string;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ title, value }) => {
  return (
    <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
};

export default DashboardStats;
