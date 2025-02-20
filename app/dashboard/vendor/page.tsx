"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import DashboardHeader from "../../../components/dashboard/DashboardHeader";
import DashboardStats from "../../../components/dashboard/DashboardStats";
import ProductList from "../../../components/shop/ProductList";
import OrderList from "../../../components/orders/OrderList";
import SalesChart from "../../../components/dashboard/charts/SalesChart";
import BestSellingChart from "../../../components/dashboard/charts/BestSellingChart";
import RevenueChart from "../../../components/dashboard/charts/RevenueChart";
import CustomerFrequencyChart from "../../../components/dashboard/charts/CustomerFrequencyChart";
import OrdersChart from "../../../components/dashboard/charts/OrdersChart";
import Link from "next/link";
import { Order } from "../../types";

const VendorDashboard = () => {
  const [shopOpen, setShopOpen] = useState(true);
  const [vendorName, setVendorName] = useState("Vendor");
  const [orders, setOrders] = useState<Order[]>([]); // ✅ Fix: Initialize orders

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Simulated API response for vendor
    const fetchVendor = async () => {
      const vendor = { name: "Jane Doe" }; // Replace with actual API call
      setVendorName(vendor.name);
    };
    fetchVendor();

    // Simulated API call for orders (replace with actual API call)
    const fetchOrders = async () => {
      const mockOrders: Order[] = [
        {
          id: "1",
          customer: "John Doe",
          shop: "Tech Store",
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
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  return (
    <DashboardLayout role="vendor">
      <DashboardHeader title={`Welcome, ${vendorName}!`} subtitle="Manage your products and track sales." />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        <DashboardStats title="Total Sales" value="$5,320" />
        <DashboardStats title="Total Orders" value="142" />
        <DashboardStats title="Pending Orders" value="8" />
      </div>

      <div className="mt-6 p-4 bg-gray-800 rounded-lg flex items-center justify-between">
        <span className="text-white text-lg">Shop Status: {shopOpen ? "Open 🟢" : "Closed 🔴"}</span>
        <button
          onClick={() => setShopOpen(!shopOpen)}
          className={`px-4 py-2 rounded-md font-semibold ${
            shopOpen ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {shopOpen ? "Close Shop" : "Open Shop"}
        </button>
      </div>

      <section className="mt-6">
        <h2 className="text-xl font-semibold text-white">Sales Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          <SalesChart className="w-full h-full transition duration-300 hover:shadow-[0_0_20px_rgba(0,255,255,0.5)]" />
          <BestSellingChart className="w-full h-full transition duration-300 hover:shadow-[0_0_20px_rgba(0,255,255,0.5)]" />
          <RevenueChart className="w-full h-full transition duration-300 hover:shadow-[0_0_20px_rgba(0,255,255,0.5)]" />
          <OrdersChart className="w-full h-full transition duration-300 hover:shadow-[0_0_20px_rgba(0,255,255,0.5)]" />
          <CustomerFrequencyChart className="w-full h-full md:col-span-2 transition duration-300 hover:shadow-[0_0_20px_rgba(0,255,255,0.5)]" />
        </div>

        <div className="flex justify-center mt-6">
          <Link href="/dashboard/vendor/analytics" className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition">
            View Full Report
          </Link>
        </div>
      </section>

      <section className="mt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Your Products</h2>
          <Link href="/dashboard/vendor/shop" className="text-blue-400 hover:text-blue-300 transition flex items-center">
            See More <span className="ml-1">→</span>
          </Link>
        </div>
        <ProductList />
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold text-white">Recent Orders</h2>
        <OrderList orders={orders} onOpenModal={handleOpenModal} />
      </section>
    </DashboardLayout>
  );
};

export default VendorDashboard;
