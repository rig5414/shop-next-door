"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "../../../../components/layout/DashboardLayout";
import VendorsTable from "../../../../components/tables/VendorTable";
import AddShopModal from "../../../../components/shop/AddShopModal";

interface Vendor {
  id: string;
  sshopId: string;
  name: string;
  shop: string;
  shopId?: string;
  status: "active" | "inactive";
  category: "local_shop" | "grocery_shop";
}

const AdminVendorsPage = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddShopModalOpen, setIsAddShopModalOpen] = useState(false);

  useEffect(() => {
    fetchVendors();
  }, []);

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

      console.log("usersData: ", usersData);
      console.log("shopsData: ", shopsData);

      const vendorUsers = usersData.filter((user: any) => user.role == "vendor");

      const formattedVendors = vendorUsers.map((vendor: any) => {
        const shop = shopsData.find((s: any) => s.vendor.id === vendor.id);
        console.log(`Vendor: ${vendor}, Shop:`, shop); // Debugging

        return {
          id: vendor.id,
          sshopId: shop?.id,
          name: vendor.name,
          shop: shop?.name || "No Shop",
          status: shop?.status, // Directly using DB value
          category: shop?.type ? shop.type : "local_shop", // Ensure valid category
        };
      });

      console.log("formattedVendors: ", formattedVendors);

      setVendors(formattedVendors);
    } catch (err) {
      console.error("Fetch Vendors Error:", err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Function to change vendor status (active <-> inactive)
  const toggleVendorStatus = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/shops/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to update status");

      // Only update state if API call succeeds
      await fetchVendors();
    } catch (err) {
      console.error(err);
      alert("Error updating vendor status");
    }
  };

  // Function to change vendor category (local_shop <-> grocery_shop)
  const updateVendorCategory = async (
    id: string,
    newCategory: "local_shop" | "grocery_shop"
  ) => {
    try {
      const response = await fetch(`/api/shops/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: newCategory }),
      });

      if (!response.ok) throw new Error("Failed to update category");

      // Only update state if API call succeeds
      setVendors((prev) =>
        prev.map((v) => (v.id === id ? { ...v, type: newCategory } : v))
      );

      await fetchVendors();
    } catch (err) {
      console.error(err);
      alert("Error updating vendor category");
    }
  };

 // Function to delete a vendor's shop
const deleteVendorShop = async (id: string) => {
  try {
    console.log(`Attempting to delete shop with ID: ${id}`);
    
    const response = await fetch(`/api/shops/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    console.log('Delete response status:', response.status);
    
    // Try to get the error message from the response
    const responseData = await response.json();
    console.log('Delete response data:', responseData);

    if (!response.ok) {
      throw new Error(responseData.message || "Failed to delete shop");
    }

    console.log('Shop deleted successfully, updating UI...');
    
    // Update the vendor in the state to show "No Shop"
    setVendors((prev) =>
      prev.map((v) => (v.id === id ? { ...v, shop: "No Shop", shopId: undefined, } : v))
    );

    console.log('Starting vendors refresh...');
    await fetchVendors();

  } catch (err: any) { // Type the error as 'any' to access its properties
    console.error('Delete shop error details:', {
      name: err?.name,
      message: err?.message,
      stack: err?.stack,
      response: err?.response,
      // Log the full error object to see all available properties
      fullError: err
    });
    
    // More specific error message to the user
    const errorMessage = err?.message || "Error deleting vendor shop";
    alert(errorMessage);
  }
};

  return (
    <DashboardLayout role="admin">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Vendor Management</h1>
          <button
            onClick={() => setIsAddShopModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add Shop
          </button>
        </div>

        {loading ? (
          <div className="flex justify-start items-center h-full">
            <p className="text-gray-400">Loading vendors..</p>
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <VendorsTable
            vendors={vendors}
            toggleVendorStatus={toggleVendorStatus}
            updateVendorCategory={updateVendorCategory}
            deleteVendorShop={deleteVendorShop}
          />
        )}
      </div>

      <AddShopModal
        isOpen={isAddShopModalOpen}
        onClose={() => setIsAddShopModalOpen(false)}
        onSuccess={fetchVendors}
      />
    </DashboardLayout>
  );
};

export default AdminVendorsPage;