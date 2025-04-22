"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import DashboardHeader from "../../../components/dashboard/DashboardHeader";
import DashboardStats from "../../../components/dashboard/DashboardStats";
import UsersTable from "../../../components/tables/UserTable";
import VendorsTable from "../../../components/tables/VendorTable";
import OrdersChart from "../../../components/dashboard/charts/OrdersChart";
import RevenueChart from "../../../components/dashboard/charts/RevenueChart";
import { useSession } from "next-auth/react";
import { useProfile } from "../../../components/profile/ProfileContext";
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
  sshopId: string;
  name: string;
  shop: string;
  status: "active" | "inactive";
  category: "local_shop" | "grocery_shop";
}

const AdminDashboard = () => {
  const { data: session } = useSession();
  const { profile } = useProfile(); 
  const adminId = session?.user?.id;
  
  const [users, setUsers] = useState<User[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalVendors, setTotalVendors] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [platformRevenue, setPlatformRevenue] = useState("Ksh 0.00");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [usersRes, shopsRes, ordersRes, transactionsRes] = await Promise.all([
        fetch("/api/users"),
        fetch("/api/shops"),
        fetch("/api/orders"),
        fetch("/api/transactions"),
      ]);

      const usersData = await usersRes.json();
      const shopsData = await shopsRes.json();
      const ordersData = await ordersRes.json();
      const transactionsData = await transactionsRes.json();

      setUsers(usersData);
      setTotalUsers(usersData.length);
      
      // Format vendors data to match what VendorsTable expects
      const vendorUsers = usersData.filter((user: any) => user.role === "vendor");
      const formattedVendors = vendorUsers.map((vendor: any) => {
        const shop = shopsData.find((s: any) => s.vendor?.id === vendor.id);
        return {
          id: vendor.id,
          sshopId: shop?.id || "",
          name: vendor.name,
          shop: shop?.name || "No Shop",
          status: shop?.status || "inactive",
          category: shop?.type || "local_shop",
        };
      });
      
      setVendors(formattedVendors);
      setTotalVendors(formattedVendors.length);
      setTotalOrders(ordersData.length);

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

  // Updated to match VendorsTable's expected function
  const toggleVendorStatus = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/shops/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
        credentials: "include"
      });

      if (!response.ok) throw new Error("Failed to update status");
      
      // Refresh all dashboard data
      await fetchDashboardData();
    } catch (err) {
      console.error("Failed to update vendor status", err);
      alert("Error updating vendor status");
    }
  };

  // Add functions needed by VendorsTable
  const updateVendorCategory = async (id: string, newCategory: "local_shop" | "grocery_shop") => {
    try {
      const response = await fetch(`/api/shops/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: newCategory }),
      });

      if (!response.ok) throw new Error("Failed to update category");
      
      // Refresh all dashboard data
      await fetchDashboardData();
    } catch (err) {
      console.error(err);
      alert("Error updating vendor category");
    }
  };

  const deleteVendorShop = async (id: string) => {
    try {
      const response = await fetch(`/api/shops/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete shop");
      
      // Refresh all dashboard data
      await fetchDashboardData();
    } catch (err) {
      console.error(err);
      alert("Error deleting vendor shop");
    }
  };

  // Add functions needed by UsersTable
  const handleLoginAsUser = async (id: string) => {
    try {
      const response = await fetch(`/api/auth/login-as/${id}`, {
        method: "POST",
        credentials: "include"
      });

      if (!response.ok) throw new Error("Failed to login as user");
      
      const data = await response.json();
      // Open a new tab with the user's session
      window.open(`/dashboard?token=${data.token}`, '_blank');
    } catch (err) {
      console.error("Failed to login as user", err);
      alert("Error logging in as user");
    }
  };

  const updateUserRole = async (id: string, role: string) => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
        credentials: "include"
      });

      if (!response.ok) throw new Error("Failed to update user role");
      
      // Refresh all dashboard data
      await fetchDashboardData();
    } catch (err) {
      console.error("Failed to update user role", err);
      alert("Error updating user role");
    }
  };

  const deleteUser = async (id: string) => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "DELETE",
        credentials: "include"
      });

      if (!response.ok) throw new Error("Failed to delete user");
      
      // Refresh all dashboard data
      await fetchDashboardData();
    } catch (err) {
      console.error("Failed to delete user", err);
      alert("Error deleting user");
    }
  };

  const updateUserDetails = async (id: string, updatedUser: Partial<User>) => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
        credentials: "include"
      });

      if (!response.ok) throw new Error("Failed to update user details");
      
      // Refresh all dashboard data
      await fetchDashboardData();
    } catch (err) {
      console.error("Failed to update user details", err);
      alert("Error updating user details");
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="admin">
        <DashboardHeader userName={`${profile.firstName} ${profile.lastName}`} title="Admin Dashboard" subtitle="Loading data..." />
        <p className="text-white text-center mt-6">Loading dashboard data...</p>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout role="admin">
        <DashboardHeader userName={`${profile.firstName} ${profile.lastName}`} title="Admin Dashboard" subtitle="Error loading data" />
        <p className="text-red-500 text-center mt-6">{error}</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">
      <DashboardHeader userName={`${profile.firstName} ${profile.lastName}`} title={`Welcome, ${profile.firstName} ${profile.lastName}!`} subtitle="Manage users, vendors, orders, and shops." />

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
        <UsersTable 
          users={users}
          handleLoginAsUser={handleLoginAsUser}
          updateUserRole={updateUserRole}
          deleteUser={deleteUser}
          updateUserDetails={updateUserDetails}
        />
      </section>

      {/* Vendor Management Section */}
      <section className="mt-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">Vendor Management</h2>
          <Link href="/dashboard/admin/vendors" className="text-blue-400 hover:text-blue-300 transition">
            View All Vendors →
          </Link>
        </div>
        <VendorsTable 
          vendors={vendors} 
          toggleVendorStatus={toggleVendorStatus} 
          updateVendorCategory={updateVendorCategory}
          deleteVendorShop={deleteVendorShop}
        />
      </section>
    </DashboardLayout>
  );
};

export default AdminDashboard;