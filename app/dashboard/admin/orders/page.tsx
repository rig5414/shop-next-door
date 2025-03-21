"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "../../../../components/layout/DashboardLayout";
import OrdersOverview from "../../../../components/orders/OrdersOverview";
import OrdersTable from "../../../../components/tables/OrdersTable";
import OrdersExport from "../../../../components/orders/OrdersExport";
import OrderDetailsDrawer from "../../../../components/orders/OrderDetailsDrawer";
import { Order } from "../../../types";

// Replace with real API endpoints
const fetchOrders = async () => {
  const response = await fetch("/api/orders");
  if (response.ok) {
    return await response.json();
  }
  throw new Error("Failed to fetch orders");
};

const fetchOrderStats = async () => {
  const response = await fetch("/api/orders/stats");
  if (response.ok) {
    return await response.json();
  }
  throw new Error("Failed to fetch order statistics");
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

  // Fetch orders and order stats on component mount
  useEffect(() => {
    const loadOrders = async () => {
      try {
        const fetchedOrders = await fetchOrders();
        setOrders(fetchedOrders);
      } catch (error) {
        console.error(error);
      }
    };

    const loadOrderStats = async () => {
      try {
        const fetchedStats = await fetchOrderStats();
        setOrderStats(fetchedStats);
      } catch (error) {
        console.error(error);
      }
    };

    loadOrders();
    loadOrderStats();
  }, []);

  // Handle updating order status
  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, orderStatus: newStatus } : order
          )
        );
        console.log(`Order ${orderId} status updated to ${newStatus}`);
      } else {
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
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
        console.log(`Order ${orderId} deleted`);
      } else {
        throw new Error("Failed to delete order");
      }
    } catch (error) {
      console.error(error);
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
