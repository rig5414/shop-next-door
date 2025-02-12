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

// Sample users
const sampleUsers: User[] = [
  { id: "1", name: "John Doe", email: "john@example.com", role: "customer", status: "Active" },
  { id: "2", name: "Alice Smith", email: "alice@example.com", role: "vendor", status: "Active" },
  { id: "3", name: "Bob Johnson", email: "bob@example.com", role: "customer", status: "Suspended" },
];

// Sample vendors
const sampleVendors: Vendor[] = [
  { id: "1", name: "Sarah Lee", shop: "Sarah's Boutique", status: "Approved" },
  { id: "2", name: "Tom Carter", shop: "Tom's Electronics", status: "Pending" },
  { id: "3", name: "Emily Green", shop: "Emily's Fashion", status: "Suspended" },
];

const handleLoginAsUser = (id: string) => {
  alert(`Logging in as user ${id}`); 
  // Implement actual login logic later
};

const AdminDashboard = () => {
  const [users, setUsers] = useState<User[] | null>(null);
  const [vendors, setVendors] = useState<Vendor[] | null>(null);
  const [totalUsers, setTotalUsers] = useState(1200);
  const [totalVendors, setTotalVendors] = useState(300);
  const [totalOrders, setTotalOrders] = useState(4500);
  const [platformRevenue, setPlatformRevenue] = useState("$120,450");
  const [adminName, setAdminName] = useState("Admin");

  useEffect(() => {
    // Simulated API response for admin (Replace this with Auth0 later)
    const fetchAdmin = async () => {
      const admin = { name: "Manasseh Telle" };
      setAdminName(admin.name);
    };
    fetchAdmin();

    // Load users
    setUsers(sampleUsers);

    // Load vendors
    setVendors(sampleVendors);
  }, []);

  // Toggle user status function
  const toggleUserStatus = (id: string) => {
    if (!users) return;
    setUsers((prevUsers) =>
      prevUsers!.map((user) =>
        user.id === id
          ? {
              ...user,
              status: user.status === "Active" ? "Suspended" : "Active",
            }
          : user
      )
    );
  };  

  // Toggle vendor status function
  const toggleVendorStatus = (id: string) => {
    if (!vendors) return;
    setVendors((prevVendors) =>
      prevVendors!.map((vendor) =>
        vendor.id === id
          ? {
              ...vendor,
              status:
                vendor.status === "Approved"
                  ? "Suspended"
                  : vendor.status === "Suspended"
                  ? "Pending"
                  : "Approved",
            }
          : vendor
      )
    );
  };

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
          <UsersTable users={users} toggleUserStatus={toggleUserStatus}  handleLoginAsUser={handleLoginAsUser}/>
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
        {vendors ? (
          <VendorsTable vendors={vendors} toggleVendorStatus={toggleVendorStatus} />
        ) : (
          <div className="text-red-500 p-4">No vendors available.</div>
        )}
      </section>
    </DashboardLayout>
  );
};

export default AdminDashboard;
