"use client";

import { useState } from "react";
import DashboardLayout from "../../../../components/layout/DashboardLayout";
import OrderList from "../../../../components/orders/OrderList";
import OrderDetailsModal from "../../../../components/orders/OrderDetailsModal";
import { OrderStatus,PaymentStatus } from "../../../types";

const mockOrders = [
  {
    id: "1",
    customer: "John Doe",
    shop: "TechHub",
    orderStatus: "Pending" as OrderStatus,
    paymentStatus: "Paid" as PaymentStatus,
    total: 120.99,
    items: [
      { id: "101", name: "Wireless Mouse", price: 35.99, quantity: 1 },
      { id: "102", name: "Mechanical Keyboard", price: 85.00, quantity: 1 },
    ],
  },
  {
    id: "2",
    customer: "John Doe",
    shop: "Fashion Avenue",
    orderStatus: "Completed" as OrderStatus,
    paymentStatus: "Pending" as PaymentStatus,
    total: 49.99,
    items: [
      { id: "201", name: "Denim Jacket", price: 49.99, quantity: 1 },
    ],
  },
];

const OrdersPage = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleOpenModal = (order: any) => {
    setSelectedOrder(order);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
  };

  return (
    <DashboardLayout role="customer">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white">Your Orders</h1>
        <p className="text-gray-300">Track your past and current orders.</p>

        {/* Order List */}
        <div className="mt-6">
          <OrderList orders={mockOrders} onOpenModal={handleOpenModal} />
        </div>

        {/* Order Details Modal */}
        {selectedOrder && (
          <OrderDetailsModal order={selectedOrder} onClose={handleCloseModal} />
        )}
      </div>
    </DashboardLayout>
  );
};

export default OrdersPage;
