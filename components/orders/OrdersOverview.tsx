import React from "react";

interface OrdersOverviewProps {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  avgOrderValue?: number;
}

const OrdersOverview: React.FC<OrdersOverviewProps> = ({
  totalOrders,
  pendingOrders,
  completedOrders,
  cancelledOrders,
  avgOrderValue,
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
      {/* Total Orders */}
      <div className="bg-gray-900 p-4 rounded-lg shadow-lg text-center">
        <h3 className="text-lg font-semibold">Total Orders</h3>
        <p className="text-2xl font-bold">{totalOrders}</p>
      </div>

      {/* Pending Orders */}
      <div className="bg-yellow-500 p-4 rounded-lg shadow-lg text-center">
        <h3 className="text-lg font-semibold">Pending</h3>
        <p className="text-2xl font-bold">{pendingOrders}</p>
      </div>

      {/* Completed Orders */}
      <div className="bg-green-500 p-4 rounded-lg shadow-lg text-center">
        <h3 className="text-lg font-semibold">Completed</h3>
        <p className="text-2xl font-bold">{completedOrders}</p>
      </div>

      {/* Cancelled Orders */}
      <div className="bg-red-500 p-4 rounded-lg shadow-lg text-center">
        <h3 className="text-lg font-semibold">Cancelled</h3>
        <p className="text-2xl font-bold">{cancelledOrders}</p>
      </div>

      {/* Optional: Average Order Value */}
      {avgOrderValue !== undefined && (
        <div className="bg-blue-500 p-4 rounded-lg shadow-lg text-center col-span-2 md:col-span-1">
          <h3 className="text-lg font-semibold">Avg Order Value</h3>
          <p className="text-2xl font-bold">${avgOrderValue.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
};

export default OrdersOverview;
