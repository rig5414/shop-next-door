"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

const CustomerSecuritySettings = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This action is irreversible.")) {
      return;
    }

    const password = prompt("Enter your password to confirm account deletion:");
    if (!password) return; // User canceled the input

    if (!session?.user?.id) {
      setError("User ID is missing. Please log in again.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/users/${session.user.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
        credentials: "include",
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to delete account.");
      }

      alert("Your account has been deleted.");
      window.location.href = process.env.NODE_ENV === "development" ? "http://localhost:3000" : "/";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 p-4 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-white">Security & Privacy</h2>

      <div className="mt-4 space-y-4">
        <button
          className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded text-white w-full"
          onClick={() => (window.location.href = "/dashboard/profile")}
        >
          Change Password
        </button>

        <button
          className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded text-white w-full"
          onClick={handleDeleteAccount}
          disabled={loading}
        >
          {loading ? "Deleting..." : "Delete Account"}
        </button>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>
    </div>
  );
};

export default CustomerSecuritySettings;
