"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "../../../../components/layout/DashboardLayout";
import OrderList from "../../../../components/orders/OrderList";
import OrderDetailsModal from "../../../../components/orders/OrderDetailsModal";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Order } from "../../../types";

const OrdersPage = () => {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchOrders = async () => {
      try {
        const response = await fetch(`/api/orders?customerId=${session.user.id}`);
        const data: Order[] = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid order data format");
        }

        setOrders(data);
      } catch (err) {
        setError("Something went wrong. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [session?.user?.id]);

  const handleOpenModal = (order: Order) => {
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

        {/* Loading state */}
        {loading && (
          <div className="flex items-center gap-2 text-gray-400 mt-4">
            Loading your orders...
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Error message */}
        {error && <p className="text-red-500 mt-4">{error}</p>}

        {/* If orders exist, show the list */}
        {!loading && !error && orders.length > 0 ? (
          <div className="mt-6">
            <OrderList orders={orders} onOpenModal={handleOpenModal} />
          </div>
        ) : (
          // If no orders, show message and link to shops
          !loading &&
          !error && (
            <div className="mt-6 text-center">
              <p className="text-gray-400">Currently, you haven&#39;t bought anything.</p>
              <p className="text-gray-400">Would you like to buy something?</p>
              <Link href="/dashboard/customer/shops" className="text-blue-500 underline mt-2 inline-block">
                Click here to explore shops
              </Link>
            </div>
          )
        )}

        {/* Order Details Modal */}
        {selectedOrder && <OrderDetailsModal order={selectedOrder} onClose={handleCloseModal} />}
      </div>
    </DashboardLayout>
  );
};

export default OrdersPage;
