"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import DashboardHeader from "../../../components/dashboard/DashboardHeader";
import DashboardStats from "../../../components/dashboard/DashboardStats";
import OrderList from "../../../components/orders/OrderList";
import ProductList from "../../../components/shop/ProductList";
import Link from "next/link";
import { FiShoppingBag } from "react-icons/fi";
import { Order } from "../../types";

type Shop = {
  id: string;
  name: string;
  description: string;
  isOpen: boolean;
};

const CustomerDashboard = () => {
  const { data: session, status } = useSession();
  const [customerName, setCustomerName] = useState("User");
  const [openShops, setOpenShops] = useState<Shop[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalSpent: 0,
  });

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setCustomerName(session.user.name || "User");
      fetchOrders(session.user.id); // Fetch only this user's orders
      fetchShops();
    }
  }, [session, status]);

  // Fetch customer orders
  const fetchOrders = async (customerId: string) => {
    try {
      const res = await fetch(`/api/orders?customerId=${customerId}`);
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data: Order[] = await res.json();
  
      setOrders(data);
  
      // Ensure `order.total` is always a number
      const totalOrders = data.length;
      const pendingOrders = data.filter((order) => order.orderStatus === "Pending").length;
      const totalSpent = data.reduce((sum, order) => sum + (Number(order.total) || 0), 0);
  
      setStats({ totalOrders, pendingOrders, totalSpent });
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };
  

  // Fetch open shops
  const fetchShops = async () => {
    try {
      const res = await fetch("/api/shops");
      if (!res.ok) throw new Error("Failed to fetch shops");
      const data: Shop[] = await res.json();

      setOpenShops(data.filter((shop) => shop.isOpen));
    } catch (error) {
      console.error("Error fetching shops:", error);
    }
  };

  const handleOpenModal = (order: Order) => {
    console.log("Open order details:", order);
  };

  return (
    <DashboardLayout role="customer">
      {/* Dashboard Header */}
      <DashboardHeader title={`Welcome, ${customerName}!`} subtitle="Here’s what’s happening today." />

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        <DashboardStats title="Total Orders" value={stats.totalOrders.toString()} />
        <DashboardStats title="Pending Orders" value={stats.pendingOrders.toString()} />
        <DashboardStats title="Total Spent" value={`Ksh. ${stats.totalSpent.toLocaleString()}`} />
      </div>

      {/* Recent Orders */}
      <section className="mt-6">
        <h2 className="text-xl font-semibold text-white">Recent Orders</h2>
        <OrderList orders={orders} onOpenModal={handleOpenModal} />
      </section>

      {/* Recommended Products */}
      <section className="mt-6">
        <h2 className="text-xl font-semibold text-white">Recommended for You</h2>
        <ProductList />
      </section>

      {/* Open Shops Section */}
      <section className="mt-6 bg-gray-800 p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-white mb-3">Open Shops</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {openShops.length > 0 ? (
            openShops.map((shop) => (
              <Link key={shop.id} href={`/shop/${shop.id}`} className="block bg-gray-900 p-4 rounded-md hover:bg-gray-700 transition">
                <div className="flex items-center">
                  <FiShoppingBag className="text-blue-400 w-6 h-6 mr-3" />
                  <div>
                    <h4 className="text-lg font-medium text-white">{shop.name}</h4>
                    <p className="text-sm text-gray-400">{shop.description}</p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-gray-400">No open shops available.</p>
          )}
        </div>
      </section>
    </DashboardLayout>
  );
};

export default CustomerDashboard;
