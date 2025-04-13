"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "../../../../components/layout/DashboardLayout";
import OrdersOverview from "../../../../components/orders/OrdersOverview";
import OrdersTable from "../../../../components/tables/OrdersTable";
import OrdersExport from "../../../../components/orders/OrdersExport";
import OrderDetailsDrawer from "../../../../components/orders/OrderDetailsDrawer";
import { Order, OrderStatus } from "../../../types";

// Helper function to normalize status case for comparison
const normalizeStatus = (status: string): string => {
  return status.toLowerCase()
}

// Helper function to count orders by normalized status
const countOrdersByStatus = (orders: Order[], statusToMatch: string): number => {
  return orders.filter((order) => normalizeStatus(order.status) === normalizeStatus(statusToMatch)).length
}

// Replace with real API endpoints
const fetchOrders = async () => {
  const response = await fetch("/api/orders");
  if (response.ok) {
    return await response.json();
  }
  throw new Error("Failed to fetch orders");
};

const OrdersPage = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderStats, setOrderStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    avgOrderValue: 0,
  });

  // Fetch orders and calculate stats on component mount
  useEffect(() => {
    const loadOrders = async () => {
      try {
        const fetchedOrders = await fetchOrders();
        setOrders(fetchedOrders);
        
        // Calculate stats from fetched orders
        const totalCount = fetchedOrders.length;
        const pendingCount = countOrdersByStatus(fetchedOrders, "pending");
        const completedCount = countOrdersByStatus(fetchedOrders, "completed");
        const cancelledCount = countOrdersByStatus(fetchedOrders, "cancelled");
        
        // Calculate average order value
        const totalValue = fetchedOrders.reduce((sum: number, order: Order) => sum + Number(order.total), 0);
        const avgValue = totalCount > 0 ? totalValue / totalCount : 0;
        
        setOrderStats({
          totalOrders: totalCount,
          pendingOrders: pendingCount,
          completedOrders: completedCount,
          cancelledOrders: cancelledCount,
          avgOrderValue: avgValue,
        });
      } catch (error) {
        console.error(error);
      }
    };

    loadOrders();
  }, []);

  // Handle updating order status
  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const response = await fetch("/api/orders", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: orderId, status:normalizeStatus(newStatus) }),
      });
      if (response.ok) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        );
        console.log(`Order ${orderId} status updated to ${newStatus}`);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("Update faled:", errorData);
        throw new Error("Failed to update order status");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Handle refunding an order
  const handleRefund = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/refund`, {
        method: "POST",
      });
      if (response.ok) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, TransactionStatus: "Refunded" } : order
          )
        )
        console.log(`Order ${orderId} refunded`);
      } else {
        throw new Error("Failed to refund order");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Handle deleting an order
  const handleDeleteOrder = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          id: orderId,
          role: "admin" // Add role to match API expectations
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete order");
      }

      // Update local state
      setOrders((prevOrders) => {
        const filteredOrders = prevOrders.filter((order) => order.id !== orderId);
        
        // Update stats after deletion
        const totalCount = filteredOrders.length;
        const pendingCount = countOrdersByStatus(filteredOrders, "pending");
        const completedCount = countOrdersByStatus(filteredOrders, "completed");
        const cancelledCount = countOrdersByStatus(filteredOrders, "cancelled");
        
        // Recalculate average order value
        const totalValue = filteredOrders.reduce((sum, order) => sum + Number(order.total), 0);
        const avgValue = totalCount > 0 ? totalValue / totalCount : 0;
        
        setOrderStats({
          totalOrders: totalCount,
          pendingOrders: pendingCount,
          completedOrders: completedCount,
          cancelledOrders: cancelledCount,
          avgOrderValue: avgValue,
        });

        return filteredOrders;
      });

      // Close drawer after successful deletion
      setSelectedOrder(null);

    } catch (error) {
      console.error("Delete order error:", error);
      // You might want to show an error toast/notification here
    }
  };

  return (
    <DashboardLayout role="admin">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Orders Management</h2>

        {/* Overview Section */}
        <OrdersOverview {...orderStats} />

        {/* Orders Export Section */}
        <div className="flex justify-end mb-4">
          <OrdersExport orders={orders} />
        </div>

        {/* Orders Table */}
        <OrdersTable
          orders={orders}
          onSelectOrder={setSelectedOrder}
          onDeleteOrder={handleDeleteOrder}
        />

        {/* Order Details Drawer */}
        <OrderDetailsDrawer
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdateStatus={handleUpdateStatus}
          onRefund={handleRefund}
          onDelete={handleDeleteOrder}
        />
      </div>
    </DashboardLayout>
  );
};

export default OrdersPage;
