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

// Sample users data
const sampleUsers: User[] = [
  { id: "1", name: "John Doe", email: "john@example.com", role: "customer", status: "Active" },
  { id: "2", name: "Alice Smith", email: "alice@example.com", role: "vendor", status: "Active" },
  { id: "3", name: "Bob Johnson", email: "bob@example.com", role: "customer", status: "Suspended" },
];

const AdminDashboard = () => {
  const [users, setUsers] = useState<User[] | null>(null);
  const [totalUsers, setTotalUsers] = useState(1200);
  const [totalVendors, setTotalVendors] = useState(300);
  const [totalOrders, setTotalOrders] = useState(4500);
  const [platformRevenue, setPlatformRevenue] = useState("$120,450");
  const [adminName, setAdminName] = useState("Admin"); // Default name

  useEffect(() => {
    // Simulated API response for admin (Replace this with Auth0 later)
    const fetchAdmin = async () => {
      const admin = { name: "Manasseh Telle" }; // Replace with actual API call
      setAdminName(admin.name);
    };
    fetchAdmin();

    // Load users
    setUsers(sampleUsers);
  }, []);

  // Function to toggle user status
  const toggleUserStatus = (id: string) => {
    if (!users) return;
    setUsers((prevUsers) =>
      prevUsers!.map((user) =>
        user.id === id ? { ...user, status: user.status === "Active" ? "Suspended" : "Active" } : user
      )
    );
  };

  // Function to handle logging in as a user
  const handleLoginAsUser = (id: string) => {
    alert(`Logged in as user with ID: ${id}`);
  };

  // Sample shops data
  const shops = [
    { id: 1, name: "Elite Fashion", owner: "Alice Johnson", status: "Active", products: 120 },
    { id: 2, name: "Tech Haven", owner: "Mike Smith", status: "Pending", products: 85 },
    { id: 3, name: "Green Mart", owner: "Sophia Lee", status: "Active", products: 200 },
    { id: 4, name: "Urban Trends", owner: "David Brown", status: "Suspended", products: 50 },
  ];

  return (
    <DashboardLayout role="admin">
      {/* Dashboard Header */}
      <DashboardHeader title={`Welcome, ${adminName}!`} subtitle="Manage users, vendors, orders, and shops." />

      {/* Sales & Revenue Insights */}
      <section className="mt-6">
        <h2 className="text-xl font-semibold text-white">Sales & Revenue Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <OrdersChart className="w-full h-full" />
          <RevenueChart className="w-full h-full" />
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

        {users ? (
          <UsersTable users={users} toggleUserStatus={toggleUserStatus} handleLoginAsUser={handleLoginAsUser} />
        ) : (
          <div className="text-red-500 p-4">Error: Users data is missing</div>
        )}
      </section>

      {/* Vendor Management Section */}
      <section className="mt-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">Vendor Management</h2>
          <Link href="/dashboard/admin/vendors" className="text-blue-400 hover:text-blue-300 transition">
            View All Vendors →
          </Link>
        </div>
        <VendorsTable />
      </section>

      {/* Shops Management Section */}
      <section className="mt-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">Shops Management</h2>
          <Link href="/dashboard/admin/shops" className="text-blue-400 hover:text-blue-300 transition">
            See More →
          </Link>
        </div>

        {/* Shop Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
          {shops.map((shop) => (
            <div key={shop.id} className="bg-gray-800 p-4 rounded-lg shadow-md border border-gray-700">
              <h3 className="text-lg font-semibold text-white">{shop.name}</h3>
              <p className="text-sm text-gray-400">Owner: {shop.owner}</p>
              <p className={`text-sm font-medium ${shop.status === "Active" ? "text-green-400" : shop.status === "Pending" ? "text-yellow-400" : "text-red-400"}`}>
                Status: {shop.status}
              </p>
              <p className="text-sm text-gray-300">Total Products: {shop.products}</p>
            </div>
          ))}
        </div>
      </section>
    </DashboardLayout>
  );
};

export default AdminDashboard;
