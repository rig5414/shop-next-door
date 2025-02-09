"use client";
import { useUser } from "@auth0/nextjs-auth0/client";

export default function VendorDashboard() {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Vendor Dashboard</h1>
        <p>Manage your shop and orders here.</p>
      </div>
    );
  }
  