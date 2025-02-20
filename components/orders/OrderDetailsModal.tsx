import React from "react";

const OrderDetailsModal = ({ order, onClose }: { order: any; onClose: () => void }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-gray-900 p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold text-white">Order #{order.id}</h2>
        <p className="text-gray-400">Shop: {order.shop}</p>
        <p className={`text-sm mt-1 ${order.orderStatus === "Pending" ? "text-yellow-400" : "text-green-400"}`}>
          {order.orderStatus}
        </p>

        <h3 className="text-lg font-semibold text-white mt-4">Items</h3>
        <ul className="text-gray-300">
          {order.items.map((item: any, index: number) => (
            <li key={index} className="flex justify-between mt-2">
              <span>{item.name} x {item.quantity}</span>
              <span>${item.price.toFixed(2)}</span>
            </li>
          ))}
        </ul>

        <p className="text-white font-bold mt-4">Total: ${order.total.toFixed(2)}</p>

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
