"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import DashboardHeader from "../../../components/dashboard/DashboardHeader";
import DashboardStats from "../../../components/dashboard/DashboardStats";
import UsersTable from "../../../components/tables/UserTable";
import VendorsTable from "../../../components/tables/VendorTable";
import OrdersChart from "../../../components/dashboard/charts/OrdersChart";
import RevenueChart from "../../../components/dashboard/charts/RevenueChart";
import Link from "next/link";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Suspended";
}

interface Vendor {
  id: string;
  name: string;
  shop: string;
  status: "Approved" | "Pending" | "Suspended";
}

const AdminDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalVendors, setTotalVendors] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [platformRevenue, setPlatformRevenue] = useState("Ksh 0.00");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch Users
        const usersRes = await fetch("/api/users");
        const usersData = await usersRes.json();
        setUsers(usersData);
        setTotalUsers(usersData.length);

        // Fetch Vendors (Shops)
        const vendorsRes = await fetch("/api/shops");
        const vendorsData = await vendorsRes.json();
        setVendors(vendorsData);
        setTotalVendors(vendorsData.length);

        // Fetch Orders
        const ordersRes = await fetch("/api/orders");
        const ordersData = await ordersRes.json();
        setTotalOrders(ordersData.length);

        // Fetch Revenue (Sum of successful transactions)
        const transactionsRes = await fetch("/api/transactions");
        const transactionsData = await transactionsRes.json();
        const totalRevenue = transactionsData
          .filter((t: any) => t.status === "successful")
          .reduce((acc: number, curr: any) => acc + parseFloat(curr.amount), 0);
        setPlatformRevenue(`Ksh ${totalRevenue.toLocaleString()}`);

        setLoading(false);
      } catch (err) {
        setError("Failed to load dashboard data.");
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout role="admin">
        <DashboardHeader title="Admin Dashboard" subtitle="Loading data..." />
        <p className="text-white text-center mt-6">Loading dashboard data...</p>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout role="admin">
        <DashboardHeader title="Admin Dashboard" subtitle="Error loading data" />
        <p className="text-red-500 text-center mt-6">{error}</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">
      <DashboardHeader title="Welcome, Admin!" subtitle="Manage users, vendors, orders, and shops." />

      {/* Sales & Revenue Insights */}
      <section className="mt-6">
        <h2 className="text-xl font-semibold text-white">Sales & Revenue Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <OrdersChart />
          <RevenueChart />
        </div>
      </section>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
        <DashboardStats title="Total Users" value={totalUsers.toString()} />
        <DashboardStats title="Total Vendors" value={totalVendors.toString()} />
        <DashboardStats title="Total Orders" value={totalOrders.toString()} />
        <DashboardStats title="Platform Revenue" value={platformRevenue} />
      </div>

      {/* User Management Section */}
      <section className="mt-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">User Management</h2>
          <Link href="/dashboard/admin/users" className="text-blue-400 hover:text-blue-300 transition">
            View All Users →
          </Link>
        </div>
        <UsersTable users={users}/>
      </section>

      {/* Vendor Management Section */}
      <section className="mt-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">Vendor Management</h2>
          <Link href="/dashboard/admin/vendors" className="text-blue-400 hover:text-blue-300 transition">
            View All Vendors →
          </Link>
        </div>
        <VendorsTable vendors={vendors}/>
      </section>
    </DashboardLayout>
  );
};

export default AdminDashboard;
