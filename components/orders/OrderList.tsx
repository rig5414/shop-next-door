import React from "react";
import { Order } from "../../app/types";

interface OrderListProps {
  orders: Order[];
  onOpenModal: (order: Order) => void;
}

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
          {orders.map((order) => (
            <tr key={order.id} className="border-b border-gray-700">
              <td className="p-2">{order.customer}</td>
              <td className="p-2">{order.shop}</td>
              <td className={`p-2 ${order.orderStatus === "Pending" ? "text-yellow-400" : "text-green-400"}`}>
                {order.orderStatus}
              </td>
              <td className="p-2 text-right">${order.total.toFixed(2)}</td>
              <td className="p-2 text-right">
                <button
                  onClick={() => onOpenModal(order)}
                  className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderList;
