"use client";

import React from "react";

interface OrderData {
  status: string;
  count: number;
}

interface OrdersListProps {
  title: string;
  data: OrderData[];
}

const OrdersList: React.FC<OrdersListProps> = ({ title, data }) => {
  const getStatusClass = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'completed':
        return 'bg-green-500/20 text-green-400';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const totalOrders = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md">
      <h4 className="text-lg font-semibold text-white mb-3">{title}</h4>
      <ul className="text-gray-300 space-y-2">
        {data.map((order, index) => (
          <li key={index} className="flex justify-between items-center border-b border-gray-700 pb-2">
            <div>
              <span className="font-medium capitalize">{order.status}</span>
              <span className="text-sm text-gray-400 ml-2">({order.count} orders)</span>
            </div>
            <div className={`px-2 py-1 rounded text-xs ${getStatusClass(order.status)}`}>
              {((order.count / totalOrders) * 100).toFixed(1)}%
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrdersList;