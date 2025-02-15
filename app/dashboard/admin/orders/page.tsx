"use client";

import { useState } from "react";
import DashboardLayout from "../../../../components/layout/DashboardLayout";
import OrdersOverview from "../../../../components/orders/OrdersOverview";
import OrdersTable from "../../../../components/tables/OrdersTable";
import OrdersExport from "../../../../components/orders/OrdersExport";
import OrderDetailsDrawer from "../../../../components/orders/OrderDetailsDrawer";
import { Order } from "../../../types";

const OrdersPage = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Mock Data (Replace with real API data later)
  const orderStats = {
    totalOrders: 1200,
    pendingOrders: 150,
    completedOrders: 950,
    cancelledOrders: 100,
    avgOrderValue: 45.75,
  };

  const orders: Order[] = [
    { id: "101", customer: "John Doe", shop: "TechMart", total: 299.99, paymentStatus: "Paid", orderStatus: "Completed" },
    { id: "102", customer: "Jane Smith", shop: "Fashion Hub", total: 79.49, paymentStatus: "Pending", orderStatus: "Processing" },
    { id: "103", customer: "Mike Johnson", shop: "Grocery World", total: 45.20, paymentStatus: "Failed", orderStatus: "Cancelled" },
  ];

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
        <OrdersTable orders={orders} onSelectOrder={setSelectedOrder} onDeleteOrder={(orderId) => console.log(`Deleting order ${orderId}`)} />

        {/* Order Details Drawer */}
        <OrderDetailsDrawer
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdateStatus={(orderId, newStatus) => console.log(`Updating order ${orderId} to ${newStatus}`)}
          onRefund={(orderId) => console.log(`Refunding order ${orderId}`)}
          onDelete={(orderId) => console.log(`Deleting order ${orderId}`)}
        />
      </div>
    </DashboardLayout>
  );
};

export default OrdersPage;
