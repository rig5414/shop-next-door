import React from "react";
import { Order } from "../../app/types";

interface OrderListProps {
  orders: Order[];
  onOpenModal: (order: Order) => void;
}

// Status color mapping
const statusColors: Record<string, string> = {
  pending: "text-yellow-400",
  shipped: "text-blue-400",
  completed: "text-green-400",
  cancelled: "text-red-400",
};

const OrderList: React.FC<OrderListProps> = ({ orders, onOpenModal }) => {
  return (
    <div className="bg-gray-900 p-4 rounded-lg shadow-lg">
      <table className="w-full text-white">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="text-left p-2">Customer</th>
            <th className="text-left p-2">Shop</th>
            <th className="text-left p-2">Status</th>
            <th className="text-right p-2">Total</th>
            <th className="text-right p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(orders) &&
            orders.map((order) => {
              const statusText = order.status
                ? order.status.charAt(0).toUpperCase() + order.status.slice(1)
                : "Unknown"; // Fallback if status is undefined

              return (
                <tr key={order.id} className="border-b border-gray-700">
                  <td className="p-2">{order.customer?.name || "Unknown"}</td>
                  <td className="p-2">{order.shop?.name || "Unknown"}</td>
                  <td className={`p-2 ${statusColors[order.status.toLowerCase()] || "text-gray-400"}`}>
                    {statusText}
                  </td>
                  <td className="p-2 text-right">
                    Ksh. {order.total ? Number(order.total).toFixed(2) : "0.00"}
                  </td>
                  <td className="p-2 text-right">
                    <button
                      onClick={() => onOpenModal(order)}
                      className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white"
                    >
                      View
                    </button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default OrderList;
