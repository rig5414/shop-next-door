"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "../../../../components/layout/DashboardLayout";
import VendorsTable from "../../../../components/tables/VendorTable";

interface Vendor {
  id: string;
  name: string;
  shop: string;
  status: "Approved" | "Pending" | "Suspended";
}

const AdminVendorsPage = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const [usersRes, shopsRes] = await Promise.all([
          fetch("/api/users"),
          fetch("/api/shops"),
        ]);

        if (!usersRes.ok || !shopsRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const [usersData, shopsData] = await Promise.all([
          usersRes.json(),
          shopsRes.json(),
        ]);

        const vendorUsers = usersData.filter((user: any) => user.role === "vendor");

        const formattedVendors = vendorUsers.map((vendor: any) => ({
          id: vendor.id,
          name: vendor.name,
          shop: shopsData.find((s: any) => s.vendorId === vendor.id)?.name || "No Shop",
          status: vendor.status as "Approved" | "Pending" | "Suspended",
        }));

        setVendors(formattedVendors);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);

  const toggleVendorStatus = async (id: string) => {
    try {
      setVendors((prev) =>
        prev.map((v) => (v.id === id ? { ...v, status: "Updating..." as any } : v))
      );

      const vendor = vendors.find((v) => v.id === id);
      if (!vendor) throw new Error("Vendor not found");

      const newStatus = vendor.status === "Approved" ? "Suspended" : "Approved";

      const response = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update status");

      setVendors((prev) =>
        prev.map((v) => (v.id === id ? { ...v, status: newStatus } : v))
      );
    } catch (err) {
      console.error(err);
      alert("Error updating vendor status");
    }
  };

  return (
    <DashboardLayout role="admin">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white">Vendor Management</h1>
        {loading ? (
          <p className="text-gray-400">Loading vendors...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <VendorsTable vendors={vendors} toggleVendorStatus={toggleVendorStatus} />
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminVendorsPage;
