"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import DashboardHeader from "../../../components/dashboard/DashboardHeader";
import DashboardStats from "../../../components/dashboard/DashboardStats";
import OrderList from "../../../components/orders/OrderList";
import ProductList from "../../../components/shop/ProductList";
import Link from "next/link";
import { FiShoppingBag } from "react-icons/fi";
import { Order } from "../../types";

type Shop = {
  id: number;
  name: string;
  description: string;
  isOpen: boolean;
};

const shopsData: Shop[] = [
  { id: 1, name: "FreshMart", description: "Groceries & fresh produce", isOpen: true },
  { id: 2, name: "TechHub", description: "Latest gadgets & accessories", isOpen: true },
  { id: 3, name: "Fashion Avenue", description: "Trendy clothes & accessories", isOpen: false },
];

const CustomerDashboard = () => {
  const [customerName, setCustomerName] = useState("User");
  const [openShops, setOpenShops] = useState<Shop[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Simulated API response for user
    const fetchUser = async () => {
      const user = { name: "John Doe" };
      setCustomerName(user.name);
    };
    fetchUser();

    // Filter only open shops
    setOpenShops(shopsData.filter((shop) => shop.isOpen));

    // Simulated API response for orders
    const fetchOrders = async () => {
      const mockOrders: Order[] = [
        {
          id: "1",
          customer: "John Doe",
          shop: "TechHub",
          total: 120.99,
          paymentStatus: "Paid",
          orderStatus: "Pending",
          items: [
            { id: "101", name: "Wireless Mouse", price: 40.99, quantity: 1 },
            { id: "102", name: "Keyboard", price: 80.0, quantity: 1 },
          ],
        },
      ];
      setOrders(mockOrders);
    };
    fetchOrders();
  }, []);

  const handleOpenModal = (order: Order) => {
    console.log("Open order details:", order);
  };

  return (
    <DashboardLayout role="customer">
      {/* Dashboard Header */}
      <DashboardHeader title={`Welcome, ${customerName}!`} subtitle="Here’s what’s happening today." />

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        <DashboardStats title="Total Orders" value="12" />
        <DashboardStats title="Pending Orders" value="3" />
        <DashboardStats title="Total Spent" value="$245.99" />
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

      {/* 🚀 Open Shops Section */}
      <section className="mt-6 bg-gray-800 p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-white mb-3">Open Shops</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {openShops.map((shop) => (
            <Link key={shop.id} href={`/shop/${shop.id}`} className="block bg-gray-900 p-4 rounded-md hover:bg-gray-700 transition">
              <div className="flex items-center">
                <FiShoppingBag className="text-blue-400 w-6 h-6 mr-3" />
                <div>
                  <h4 className="text-lg font-medium text-white">{shop.name}</h4>
                  <p className="text-sm text-gray-400">{shop.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </DashboardLayout>
  );
};

export default CustomerDashboard;
