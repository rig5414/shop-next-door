"use client";
import { useState } from "react";
import DashboardLayout from "../../../../components/layout/DashboardLayout";
import VendorsTable from "../../../../components/tables/VendorTable";

interface Vendor {
  id: string;
  name: string;
  shop: string;
  status: "Approved" | "Pending" | "Suspended";
}

const AdminVendorsPage = () => {
  const [vendors, setVendors] = useState<Vendor[]>([
    { id: "1", name: "Sarah Lee", shop: "Sarah's Boutique", status: "Approved" as const },
    { id: "2", name: "Tom Carter", shop: "Tom's Electronics", status: "Pending" as const },
    { id: "3", name: "Emily Green", shop: "Emily's Fashion", status: "Suspended" as const },
  ]);

  const toggleVendorStatus = (id: string) => {
    setVendors((prev) =>
      prev.map((vendor) =>
        vendor.id === id
          ? {
              ...vendor,
              status: vendor.status === "Approved" ? "Suspended" : "Approved",
            }
          : vendor
      )
    );
  };

  return (
    <DashboardLayout role="admin">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white">Vendor Management</h1>
        <VendorsTable vendors={vendors} toggleVendorStatus={toggleVendorStatus} />
      </div>
    </DashboardLayout>
  );
};

export default AdminVendorsPage;
