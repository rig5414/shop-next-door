"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "../../../../components/layout/DashboardLayout";
import OrdersOverview from "../../../../components/orders/OrdersOverview";
import OrderList from "../../../../components/orders/OrderList";
import OrdersExport from "../../../../components/orders/OrdersExport";
import OrderDetailsDrawer from "../../../../components/orders/OrderDetailsDrawer";
import { Order, OrderStatus } from "../../../types";

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/orders");
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data: Order[] = await response.json();
        setOrders(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleOpenDrawer = (order: Order) => {
    setSelectedOrder(order);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setSelectedOrder(null);
    setIsDrawerOpen(false);
  };

  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, orderStatus: newStatus } : order
      )
    );
    // TODO: Update the status on the server
  };

  const handleRefund = (orderId: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, isRefunded: true } : order
      )
    );
    console.log(`Refund issued for order ${orderId}`);
    // TODO: update refund on the server
  };

  const handleDelete = (orderId: string) => {
    setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
    // TODO: update on the server that the order was deleted.
  };

  if (isLoading) {
    return (
      <DashboardLayout role="vendor">
        <div className="p-6">
          <p>Loading orders...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout role="vendor">
        <div className="p-6">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="vendor">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white mb-4">Orders</h1>

        {/* Orders Overview Stats */}
        <OrdersOverview
          totalOrders={orders.length}
          pendingOrders={orders.filter((o) => o.status === "Pending").length}
          completedOrders={orders.filter((o) => o.status === "Completed").length}
          cancelledOrders={orders.filter((o) => o.status === "Cancelled").length}
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
  );
};

export default OrdersPage;