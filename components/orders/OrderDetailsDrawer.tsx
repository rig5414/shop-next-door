"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { OrderStatus } from "../../app/types"
import Spinner from "../ui/Spinner"

interface OrderDetailsDrawerProps {
  order: any
  onClose: () => void
  onUpdateStatus: (orderId: string, newStatus: OrderStatus) => void | Promise<void>
  onRefund: (orderId: string) => void
  onDelete: (orderId: string) => void
  isLoading?: boolean
}

const OrderDetailsDrawer: React.FC<OrderDetailsDrawerProps> = ({
  order,
  onClose,
  onUpdateStatus,
  onRefund,
  onDelete,
  isLoading,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>("")
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const [showConfirmCancel, setShowConfirmCancel] = useState(false)

  // Update selectedStatus when order changes
  useEffect(() => {
    if (order?.status) {
      const formattedStatus = order.status.charAt(0).toUpperCase() + order.status.slice(1)
      setSelectedStatus(formattedStatus)
    }
  }, [order])

  if (!order) return null

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value

    if (newStatus === "Cancelled") {
      setSelectedStatus(newStatus)
      setShowConfirmCancel(true)
      return
    }

    setSelectedStatus(newStatus)
    onUpdateStatus(order.id, newStatus as OrderStatus)
  }

  // Get transaction status from order
  const getTransactionStatus = () => {
    if (order.transaction?.status) {
      // Map 'successful' to 'Paid' for better UI
      if (order.transaction.status.toLowerCase() === "successful") {
        return "Paid"
      }
      // Capitalize first letter
      return order.transaction.status.charAt(0).toUpperCase() + order.transaction.status.slice(1)
    }
    return "Unknown"
  }

  // Helper function to get payment status color
  const getPaymentStatusColor = (status: string) => {
    if (!status) return "text-gray-400"

    switch (status.toLowerCase()) {
      case "paid":
      case "successful":
        return "text-green-500"
      case "pending":
        return "text-yellow-500"
      case "failed":
        return "text-red-500"
      default:
        return "text-gray-400"
    }
  }

  // Helper function to get payment status background
  const getPaymentStatusBg = (status: string) => {
    if (!status) return "bg-gray-800"

    switch (status.toLowerCase()) {
      case "paid":
      case "successful":
        return "bg-green-900"
      case "pending":
        return "bg-yellow-900"
      case "failed":
        return "bg-red-900"
      default:
        return "bg-gray-800"
    }
  }

  // Function to get product name from item
  const getProductName = (item: any) => {
    // Based on the console log, the product name is in item.product.catalog.name
    if (item.product?.catalog?.name) {
      return item.product.catalog.name
    }
    return "Product"
  }

  // Shorten the order ID for display
  const shortOrderId = order.id.substring(0, 8) + "..."

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50" onClick={onClose}>
      <div
        className="w-96 bg-gray-900 text-white h-full flex flex-col shadow-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Order #{shortOrderId}</h2>
          <button onClick={onClose} className="text-red-400 hover:text-red-500 text-xl">&times;</button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-3">
            {/* Customer Info */}
            <div className="mb-3">
              <p className="text-sm">
                <span className="font-semibold">Customer:</span> {order.customer?.name || "Unknown"}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Shop:</span> {order.shop?.name || "Unknown"}
              </p>
            </div>

            {/* Products */}
            <div>
              <h3 className="font-semibold text-sm mb-2">Products:</h3>
              <div className="space-y-2">
                {order.items?.length ? (
                  order.items.map((item: any, index: number) => (
                    <div key={index} className="border-b border-gray-700 pb-2">
                      <p className="text-sm">{getProductName(item)}</p>
                      <p className="text-xs text-gray-400">
                        Qty: {item.quantity} | Ksh.
                        {typeof item.price === "number" ? item.price : Number.parseFloat(item.price)}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400">No products available</p>
                )}
              </div>
            </div>

            {/* Payment Info */}
            <div className="pt-2">
              <p className="text-sm">
                <span className="font-semibold">Total Amount:</span> Ksh. {order.total}
              </p>
              <p className="flex items-center gap-2 text-sm">
                <span className="font-semibold">Payment Status:</span>{" "}
                <span
                  className={`px-2 py-0.5 rounded text-xs ${getPaymentStatusBg(getTransactionStatus())} ${getPaymentStatusColor(getTransactionStatus())}`}
                >
                  {getTransactionStatus()}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Footer Controls - Fixed at bottom */}
        <div className="p-4 border-t border-gray-700 bg-gray-900">
          <div className="mb-3">
            <label htmlFor="order-status" className="text-sm font-semibold block mb-1">
              Order Status:
            </label>
            <select
              id="order-status"
              value={selectedStatus}
              onChange={handleStatusChange}
              className="block w-full p-2 bg-gray-800 border border-gray-600 rounded text-sm"
              aria-label="Order Status"
            >
              <option value="Pending">Pending</option>
              <option value="Shipped">Shipped</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <button
            onClick={() => onUpdateStatus(order.id, selectedStatus as OrderStatus)}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <span>Updating</span>
                <Spinner />
              </>
            ) : (
              "Update Status"
            )}
          </button>

          <button
            onClick={() => setShowConfirmDelete(true)}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors w-full text-sm mt-2"
          >
            Delete Order
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirmDelete && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setShowConfirmDelete(false)}
        >
          <div className="bg-gray-800 p-4 rounded shadow-lg w-72 text-center" onClick={(e) => e.stopPropagation()}>
            <p className="text-base font-semibold mb-3">Are you sure you want to delete this order?</p>
            <div className="flex justify-between">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDelete(order.id)
                  setShowConfirmDelete(false)
                  onClose() // Close the drawer after deletion
                }}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors text-sm"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {showConfirmCancel && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setShowConfirmCancel(false)}
        >
          <div className="bg-gray-800 p-4 rounded shadow-lg w-72 text-center" onClick={(e) => e.stopPropagation()}>
            <p className="text-base font-semibold mb-3">Are you sure you want to cancel this order?</p>
            <div className="flex justify-between">
              <button
                onClick={() => {
                  setShowConfirmCancel(false)
                  setSelectedStatus(order.status.charAt(0).toUpperCase() + order.status.slice(1)) // Reset to original status with proper capitalization
                }}
                className="bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-950 transition-colors text-sm"
              >
                No
              </button>
              <button
                onClick={() => {
                  onUpdateStatus(order.id, "Cancelled" as OrderStatus)
                  setShowConfirmCancel(false)
                }}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors text-sm"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrderDetailsDrawer