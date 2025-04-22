"use client";

import React from "react";

interface CustomerData {
  customer: string;
  ordersPlaced: number;
}

interface RepeatCustomersProps {
  data: CustomerData[];
}

const RepeatCustomers: React.FC<RepeatCustomersProps> = ({ data }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md">
      <h4 className="text-lg font-semibold text-white mb-3">Frequent Customers</h4>
      <ul className="text-gray-300 space-y-2">
        {data.map((customer, index) => (
          <li key={index} className="flex justify-between items-center border-b border-gray-700 pb-2">
            <span className="font-medium">{customer.customer}</span>
            <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs">
              {customer.ordersPlaced} orders
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RepeatCustomers;