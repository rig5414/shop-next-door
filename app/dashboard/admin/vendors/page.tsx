"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "../../../../components/layout/DashboardLayout";
import VendorsTable from "../../../../components/tables/VendorTable";

interface Vendor {
  id: string;
  name: string;
  shop: string;
  status: "active" | "inactive";
  category: "local_shop" | "grocery_shop";
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

        console.log("Users Data:", usersData);
        console.log("Shops Data:", shopsData);

        const vendorUsers = usersData.filter((user: any) => user.role === "vendor");

        const formattedVendors = vendorUsers.map((vendor: any) => {
          const shop = shopsData.find((s: any) => s.vendorId === vendor.id);
          console.log(`Vendor: ${vendor.name}, Shop:`, shop); // Debugging

          return {
            id: vendor.id,
            name: vendor.name,
            shop: shop?.name || "No Shop",
            status: vendor.status === "active" ? "active" : "inactive", // Directly using DB value
            category: shop?.category || "local_shop", // Ensure valid category
          };
        });

        setVendors(formattedVendors);
      } catch (err) {
        console.error("Fetch Vendors Error:", err);
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);

  // Function to change vendor status (active <-> inactive)
  const toggleVendorStatus = async (id: string) => {
    try {
      const vendor = vendors.find((v) => v.id === id);
      if (!vendor) throw new Error("Vendor not found");

      const newStatus = vendor.status === "active" ? "inactive" : "active";

      const response = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update status");

      // Only update state if API call succeeds
      setVendors((prev) =>
        prev.map((v) => (v.id === id ? { ...v, status: newStatus } : v))
      );
    } catch (err) {
      console.error(err);
      alert("Error updating vendor status");
    }
  };

  // Function to change vendor category (local_shop <-> grocery_shop)
  const updateVendorCategory = async (id: string, newCategory: "local_shop" | "grocery_shop") => {
    try {
      const response = await fetch(`/api/shops/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: newCategory }),
      });

      if (!response.ok) throw new Error("Failed to update category");

      // Only update state if API call succeeds
      setVendors((prev) =>
        prev.map((v) => (v.id === id ? { ...v, category: newCategory } : v))
      );
    } catch (err) {
      console.error(err);
      alert("Error updating vendor category");
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
          <VendorsTable
            vendors={vendors}
            toggleVendorStatus={toggleVendorStatus}
            updateVendorCategory={updateVendorCategory}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminVendorsPage;
