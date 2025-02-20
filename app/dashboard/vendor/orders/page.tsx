"use client";

import React, { useState } from "react";
import DashboardLayout from "../../../../components/layout/DashboardLayout";
import OrdersOverview from "../../../../components/orders/OrdersOverview";
import OrderList from "../../../../components/orders/OrderList";
import OrdersExport from "../../../../components/orders/OrdersExport";
import OrderDetailsDrawer from "../../../../components/orders/OrderDetailsDrawer";
import { Order, OrderStatus } from "../../../types";

const mockOrders: Order[] = [
  {
    id: "1",
    customer: "John Doe",
    shop: "Tech Store",
    total: 120.99,
    paymentStatus: "Paid",
    orderStatus: "Pending",
    isRefunded: false, // ✅ Added isRefunded to match type
    items: [
      { id: "101", name: "Wireless Mouse", price: 40.99, quantity: 1 },
      { id: "102", name: "Keyboard", price: 80.0, quantity: 1 },
    ],
  },
  {
    id: "2",
    customer: "Jane Smith",
    shop: "Gadget Hub",
    total: 75.5,
    paymentStatus: "Paid",
    orderStatus: "Completed",
    isRefunded: false,
    items: [{ id: "201", name: "Smart Watch", price: 75.5, quantity: 1 }],
  },
];

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
  };

  const handleRefund = (orderId: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, isRefunded: true } : order
      )
    );
    console.log(`Refund issued for order ${orderId}`);
  };

  const handleDelete = (orderId: string) => {
    setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
  };

  return (
    <DashboardLayout role ="vendor">
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-4">Orders</h1>

      {/* Orders Overview Stats */}
      <OrdersOverview
        totalOrders={orders.length}
        pendingOrders={orders.filter((o) => o.orderStatus === "Pending").length}
        completedOrders={orders.filter((o) => o.orderStatus === "Completed").length}
        cancelledOrders={orders.filter((o) => o.orderStatus === "Cancelled").length}
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
