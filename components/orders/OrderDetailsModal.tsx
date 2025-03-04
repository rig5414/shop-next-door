import React from "react";
import { Order } from "../../app/types"; // Ensure you're using the correct type

interface OrderDetailsModalProps {
  order: Order;
  onClose: () => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-gray-900 p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold text-white">Order #{order.id}</h2>
        <p className="text-gray-400">Shop: {order.shop.name}</p>

        {/* Order Status */}
        <p className={`text-sm mt-1 ${order.orderStatus === "Pending" ? "text-yellow-400" : "text-green-400"}`}>
          Status: {order.orderStatus}
        </p>

        {/* Payment Status */}
        <p className={`text-sm ${order.paymentStatus === "Paid" ? "text-green-400" : "text-red-400"}`}>
          Payment: {order.paymentStatus}
        </p>

        {/* Order Items */}
        <h3 className="text-lg font-semibold text-white mt-4">Items</h3>
        <ul className="text-gray-300">
          {order.items.map((item, index) => (
            <li key={index} className="flex justify-between mt-2">
              <span>{item.name} x {item.quantity}</span>
              <span>Ksh. {(Number(item.price) || 0).toFixed(2)}</span> {/* ✅ Ensure price is a valid number */}
            </li>
          ))}
        </ul>

        {/* Total Amount */}
        <p className="text-white font-bold mt-4">Total: Ksh. {(Number(order.total) || 0).toFixed(2)}</p> {/* ✅ Ensure total is valid */}

        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded">
          Close
        </button>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
