import React, { useState } from "react";
import Image from "next/image";
import { Order, OrderStatus } from "../../app/types";

interface OrderDetailsDrawerProps {
  order: Order | null;
  onClose: () => void;
  onUpdateStatus: (orderId: string, newStatus: OrderStatus) => void;
  onRefund: (orderId: string) => void;
  onDelete: (orderId: string) => void;
}

const OrderDetailsDrawer: React.FC<OrderDetailsDrawerProps> = ({
  order,
  onClose,
  onUpdateStatus,
  onRefund,
  onDelete,
}) => {
  const [selectedStatus, setSelectedStatus] = useState(order?.orderStatus || "Pending");
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  if (!order) return null;

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as OrderStatus;
    setSelectedStatus(newStatus);
    onUpdateStatus(order.id, newStatus);
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50"
      onClick={onClose} // Close drawer when clicking outside
    >
      {/* Drawer */}
      <div 
        className="w-96 bg-gray-900 text-white h-full shadow-lg p-6 overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-red-400 hover:text-red-500 text-xl"
        >
          &times;
        </button>

        {/* Order Title */}
        <h2 className="text-2xl font-semibold mb-4">Order #{order.id}</h2>

        <div className="space-y-4">
          {/* Customer & Vendor Info */}
          <div className="border-b border-gray-700 pb-2">
            <p><span className="font-semibold">Customer:</span> {order.customer}</p>
            <p><span className="font-semibold">Shop:</span> {order.shop}</p>
          </div>

          {/* Ordered Items */}
          <div>
            <h3 className="font-semibold mb-2">Products:</h3>
            <ul className="space-y-2">
              {order?.items?.length ? (
                order.items.map((product: any, index: number) => (
                  <li key={index} className="flex items-center space-x-3 border-b border-gray-700 pb-2">
                    <Image
                      src={product.image || "/images/default-product.jpg"}
                      alt={product.name}
                      width={40}
                      height={40}
                      className="w-10 h-10 object-cover rounded"
                    />
                    <div>
                      <p>{product.name}</p>
                      <p className="text-sm text-gray-400">
                        Qty: {product.quantity} | ${product.price}
                      </p>
                    </div>
                  </li>
                ))
              ) : (
                <li className="text-gray-400">No products available</li>
              )}
            </ul>
          </div>

          {/* Order Summary */}
          <div className="border-t border-gray-700 pt-2">
            <p><span className="font-semibold">Total Amount:</span> ${order.total}</p>
            <p>
              <span className="font-semibold">Payment Status:</span>{" "}
              <span
                className={`px-2 py-1 rounded ${
                  order.paymentStatus === "Paid" ? "bg-green-600" : "bg-yellow-500"
                }`}
              >
                {order.paymentStatus}
              </span>
            </p>
          </div>

          {/* Order Status Dropdown */}
          <div className="border-t border-gray-700 pt-2">
            <label htmlFor="order-status" className="font-semibold">Order Status:</label>
            <select
              id="order-status"
              value={selectedStatus}
              onChange={handleStatusChange}
              className="block w-full mt-1 p-2 bg-gray-800 border border-gray-600 rounded"
              aria-label="Order Status"
            >
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex space-x-2">
            {order.paymentStatus === "Paid" && !order.isRefunded && (
              <button
                onClick={() => onRefund(order.id)}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Issue Refund
              </button>
            )}

            <button
              onClick={() => setShowConfirmDelete(true)}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Delete Order
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Deleting */}
      {showConfirmDelete && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowConfirmDelete(false)}
        >
          <div 
            className="bg-gray-800 p-6 rounded shadow-lg w-80 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-lg font-semibold mb-4">
              Are you sure you want to delete this order?
            </p>
            <div className="flex justify-between">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDelete(order.id);
                  setShowConfirmDelete(false);
                }}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetailsDrawer;
