"use client"

import type React from "react"
import { useState, useEffect } from "react"
import DashboardLayout from "../../../../components/layout/DashboardLayout"
import OrdersOverview from "../../../../components/orders/OrdersOverview"
import OrderList from "../../../../components/orders/OrderList"
import OrdersExport from "../../../../components/orders/OrdersExport"
import OrderDetailsDrawer from "../../../../components/orders/OrderDetailsDrawer"
import type { Order, OrderStatus } from "../../../types"
import { useSession } from "next-auth/react"

// Helper function to normalize status case for comparison
const normalizeStatus = (status: string): string => {
  return status.toLowerCase()
}

// Helper function to count orders by normalized status
const countOrdersByStatus = (orders: Order[], statusToMatch: string): number => {
  return orders.filter((order) => normalizeStatus(order.status) === normalizeStatus(statusToMatch)).length
}

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { data: session } = useSession()

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true)
      setError(null)
      try {
        // Get the vendor's ID from the session
        const vendorId = session?.user?.id

        if (!vendorId) {
          throw new Error("User ID not found. Please make sure you're logged in.")
        }

        // Use VendorId to filter orders
        const response = await fetch(`/api/orders?vendorId=${vendorId}`)

        if (!response.ok) {
          throw new Error("Failed to fetch orders")
        }

        const data: Order[] = await response.json()
        console.log("Orders data:", data)
        setOrders(data)
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError("An unexpected error occurred.")
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [session]) // Add session as a dependency to re-fetch when session changes

  const handleOpenDrawer = (order: Order) => {
    setSelectedOrder(order)
    setIsDrawerOpen(true)
  }

  const handleCloseDrawer = () => {
    setSelectedOrder(null)
    setIsDrawerOpen(false)
  }

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      // Update status on the server first
      const response = await fetch(`/api/orders`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: orderId, status: normalizeStatus(newStatus) }),
      })

      if (!response.ok) {
        throw new Error("Failed to update order status")
      }

      // If server update successful, update local state
      setOrders((prevOrders) =>
        prevOrders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)),
      )
    } catch (error) {
      console.error("Error updating order status:", error)
    }
  }

  const handleRefund = async (orderId: string) => {
    try {
      // Process refund on the server first
      const response = await fetch(`/api/orders/${orderId}/refund`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to process refund")
      }

      // If server update successful, update local state
      setOrders((prevOrders) =>
        prevOrders.map((order) => (order.id === orderId ? { ...order, isRefunded: true } : order)),
      )
      console.log(`Refund issued for order ${orderId}`)
    } catch (error) {
      console.error("Error processing refund:", error)
    }
  }

  const handleDelete = async (orderId: string) => {
    try {
      // Delete on the server first
      const response = await fetch(`/api/orders`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: orderId, role: "admin"},)
      })

      if (!response.ok) {
        throw new Error("Failed to delete order")
      }

      // If server delete successful, update local state
      setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId))
    } catch (error) {
      console.error("Error deleting order:", error)
    }
  }

  // Add debugging for status values
  useEffect(() => {
    if (orders.length > 0) {
      console.log(
        "All status values:",
        orders.map((o) => o.status),
      )
      console.log("Pending count:", countOrdersByStatus(orders, "pending"))
      console.log("Completed count:", countOrdersByStatus(orders, "completed"))
      console.log("Cancelled count:", countOrdersByStatus(orders, "cancelled"))
    }
  }, [orders])

  if (isLoading) {
    return (
      <DashboardLayout role="vendor">
        <div className="p-6">
          <p>Loading orders...</p>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout role="vendor">
        <div className="p-6">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="vendor">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white mb-4">Orders</h1>

        {/* Orders Overview Stats */}
        <OrdersOverview
          totalOrders={orders.length}
          pendingOrders={countOrdersByStatus(orders, "pending")}
          completedOrders={countOrdersByStatus(orders, "completed")}
          cancelledOrders={countOrdersByStatus(orders, "cancelled")}
        />

        {/* Export and Print Options */}
        <OrdersExport orders={orders} />

        {/* Order List */}
        <OrderList orders={orders} onOpenModal={handleOpenDrawer} />

        {/* Order Details Drawer */}
        {isDrawerOpen && selectedOrder && (
          <OrderDetailsDrawer
            order={selectedOrder}
            onClose={handleCloseDrawer}
            onUpdateStatus={handleUpdateStatus}
            onRefund={handleRefund}
            onDelete={handleDelete}
          />
        )}
      </div>
    </DashboardLayout>
  )
}

export default OrdersPage

