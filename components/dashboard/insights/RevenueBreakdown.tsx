"use client";

import React, { useMemo } from "react";

interface RevenueData {
  _sum: {
    total: number;
  };
  month: string;
}

interface RevenueBreakdownProps {
  data: RevenueData[];
}

const RevenueBreakdown: React.FC<RevenueBreakdownProps> = ({ data }) => {
  // Sort months in descending order (most recent first)
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      const dateA = new Date(a.month);
      const dateB = new Date(b.month);
      return dateB.getTime() - dateA.getTime();
    });
  }, [data]);

  const totalRevenue = useMemo(() => {
    return data.reduce((sum, item) => sum + item._sum.total, 0);
  }, [data]);

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-semibold text-white">Sales Overview</h4>
        <div className="text-right">
          <p className="text-sm text-gray-400">Total Sales</p>
          <p className="text-xl font-bold text-white">
            KES {totalRevenue.toLocaleString()}
          </p>
        </div>
      </div>
      <div className="mt-4">
        <h5 className="text-md font-semibold text-white mb-3">Monthly Revenue</h5>
        <ul className="text-gray-300 space-y-2">
          {sortedData.map((item) => (
            <li key={item.month} className="flex justify-between items-center border-b border-gray-700 pb-2">
              <span className="font-medium">{item.month}</span>
              <span className="text-green-400">
                KES {item._sum.total.toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RevenueBreakdown;