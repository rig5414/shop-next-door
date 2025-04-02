"use client"

import type React from "react"
import { useEffect } from "react"
import type { Order } from "../../app/types"

interface OrderDetailsModalProps {
  order: Order
  onClose: () => void
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order, onClose }) => {
  // Add debugging to see what fields are available
  useEffect(() => {
    console.log("Order in modal:", order)
    console.log("Order fields:", Object.keys(order))

    // Debug the first item to see its structure
    if (order.items && order.items.length > 0) {
      console.log("First item structure:", order.items[0])
      console.log("First item fields:", Object.keys(order.items[0]))
    }
  }, [order])

  // Check if status exists before using it
  const hasStatus = typeof order.status !== "undefined"
  const orderStatus = hasStatus ? order.status : null

  // Check if payment status exists before using it
  const hasPaymentStatus = typeof order.paymentStatus !== "undefined"
  const paymentStatus = hasPaymentStatus ? order.paymentStatus : null

  // Helper function to get status color
  const getOrderStatusColor = (status: string | null) => {
    if (!status) return "text-gray-400"

    switch (status.toLowerCase()) {
      case "pending":
        return "text-yellow-400"
      case "completed":
        return "text-green-400"
      case "shipped":
        return "text-blue-400"
      case "cancelled":
        return "text-red-400"
      default:
        return "text-gray-400"
    }
  }

  // Helper function to get payment status color
  const getPaymentStatusColor = (status: string | null) => {
    if (!status) return "text-gray-400"

    switch (status.toLowerCase()) {
      case "successful":
        return "text-green-400"
      case "pending":
        return "text-yellow-400"
      case "failed":
        return "text-red-400"
      default:
        return "text-gray-400"
    }
  }

  // Helper function to get item name based on your schema structure
  const getItemName = (item: any) => {
    // Try different possible paths to get the product name based on your schema
    return (
      // Direct name on the item (might be included in API response)
      item.name ||
      // If item has product with catalog
      item.product?.catalog?.name ||
      // If catalog is directly included
      item.catalog?.name ||
      // If productCatalog is included
      item.productCatalog?.name ||
      // If catalogName is directly included
      item.catalogName ||
      // If productName is directly included
      item.productName ||
      // Fallback to description if available
      item.description ||
      // Last resort fallback
      "Unnamed Product"
    )
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-50">
      <div className="bg-gray-900 p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold text-white">Order #{order.id}</h2>
        <p className="text-gray-400">Shop: {order.shop?.name || "Unknown Shop"}</p>

        {/* Order Status */}
        <p className={`text-sm mt-1 ${getOrderStatusColor(orderStatus)}`}>Status: {orderStatus || "Not available"}</p>

        {/* Payment Status - only show if available */}
        {hasPaymentStatus && (
          <p className={`text-sm ${getPaymentStatusColor(paymentStatus)}`}>Payment: {paymentStatus}</p>
        )}

        {/* Order Items */}
        <h3 className="text-lg font-semibold text-white mt-4">Items</h3>
        <ul className="text-gray-300">
          {order.items && order.items.length > 0 ? (
            order.items.map((item, index) => (
              <li key={index} className="flex justify-between mt-2">
                <span>
                  {getItemName(item)} x {item.quantity || 1}
                </span>
                <span>Ksh. {(Number(item.price) || 0).toFixed(2)}</span>
              </li>
            ))
          ) : (
            <li className="text-gray-400">No items found</li>
          )}
        </ul>

        {/* Total Amount */}
        <p className="text-white font-bold mt-4">Total: Ksh. {(Number(order.total) || 0).toFixed(2)}</p>

        {/* Close Button */}
        <button onClick={onClose} className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded">
          Close
        </button>
      </div>
    </div>
  )
}

export default OrderDetailsModal

