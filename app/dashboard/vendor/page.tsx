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
import { useSession } from "next-auth/react";
import { Order } from "../../types";
import { useProfile } from "../../../components/profile/ProfileContext";

const VendorDashboard = () => {
  const { data: session } = useSession();
  const { profile } = useProfile(); 
  const vendorId = session?.user?.id;

  const [shopOpen, setShopOpen] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shopId, setShopId] = useState("");
  const [loading, setLoading] = useState(false);

  console.log("Vendor ID:", vendorId);
  console.log("Shop ID:", shopId);

  // Fetch Shop ID first
  useEffect(() => {
    if (vendorId) {
      fetchShop();
    }
  }, [vendorId]);

  const fetchShop = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/shops?vendorId=${vendorId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch shop data");
      console.log('data for the shop: ',data)
      setShopId(data[0].id);
    } catch (error) {
      console.error("Error fetching shop:", error);
    }finally{
      setLoading(false);
    }
  };

  // Fetch Orders once vendorId is available
  useEffect(() => {
    if (!vendorId) return;

    const fetchOrders = async () => {
      try {
        const res = await fetch(`/api/orders?vendorId=${vendorId}`);
        const data = await res.json();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [vendorId]);

  // Fetch Products ONLY after shopId is available
  useEffect(() => {
    if (!shopId) return;

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products?shopId=${shopId}`);
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }finally{
        setLoading(false);
      }
    };

    fetchProducts();
  }, [shopId]); // ✅ Runs ONLY when `shopId` is available

  const toggleShopStatus = async () => {
    try {
      const newStatus = shopOpen ? "inactive" : "active";
      await fetch(`/api/vendors/${vendorId}/shop-status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      setShopOpen(!shopOpen);
    } catch (error) {
      console.error("Error updating shop status:", error);
    }
  };

  return (
    <DashboardLayout role="vendor">
      <DashboardHeader
        title={`Welcome, ${profile.firstName} ${profile.lastName}!`} 
        subtitle="Manage your products and track sales."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        <DashboardStats title="Total Sales" value="Ksh. 5,320" />
        <DashboardStats title="Total Orders" value="142" />
        <DashboardStats title="Pending Orders" value="8" />
      </div>

      <div className="mt-6 p-4 bg-gray-800 rounded-lg flex items-center justify-between">
        <span className="text-white text-lg">Shop Status: {shopOpen ? "Open 🟢" : "Closed 🔴"}</span>
        <button
          onClick={toggleShopStatus}
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
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold text-white">Your Products</h2>
        {loading ?<>Loading..</> : <> {products.length > 0 && <ProductList products={products} /> }</>}
       
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold text-white">Recent Orders</h2>
        <OrderList orders={orders} onOpenModal={(order) => setSelectedOrder(order)} />
      </section>
    </DashboardLayout>
  );
};

export default VendorDashboard;
