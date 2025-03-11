"use client";

import { useState, useEffect } from "react";
import UsersTable from "../../../../components/tables/UserTable";
import DashboardLayout from "../../../../components/layout/DashboardLayout";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Suspended";
}

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users");
        if (!response.ok) throw new Error(`Failed to fetch users: ${response.statusText}`);
        const data = await response.json();
        setUsers(data);
      } catch (err: any) {
        setError(err.message || "Error loading users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const toggleUserStatus = async (id: string) => {
    const user = users.find((user) => user.id === id);
    if (!user) return;

    const updatedStatus = user.status === "Active" ? "Suspended" : "Active";

    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: updatedStatus }),
      });

      if (!response.ok) throw new Error(`Failed to update user status: ${response.statusText}`);

      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === id ? { ...u, status: updatedStatus } : u))
      );
    } catch (err: any) {
      setError(err.message || "Error updating user status.");
    }
  };

  const handleLoginAsUser = async (id: string) => {
    try {
      const response = await fetch(`/api/users/${id}/login-as`, { method: "POST" });

      if (!response.ok) throw new Error(`Failed to log in as user: ${response.statusText}`);

      const data = await response.json();
      window.location.href = data.redirectUrl || "/dashboard";
    } catch (err: any) {
      setError(err.message || "Error logging in as user.");
    }
  };

  const updateUserRole = async (id: string, newRole: string) => {
    try {
      const response = await fetch(`/api/users/${id}/role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) throw new Error(`Failed to update role: ${response.statusText}`);

      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === id ? { ...u, role: newRole } : u))
      );
    } catch (err: any) {
      setError(err.message || "Error updating role.");
    }
  };

  const deleteUser = async (id: string) => {
    try {
      const response = await fetch(`/api/users/${id}`, { method: "DELETE" });

      if (!response.ok) throw new Error(`Failed to delete user: ${response.statusText}`);

      setUsers((prevUsers) => prevUsers.filter((u) => u.id !== id));
    } catch (err: any) {
      setError(err.message || "Error deleting user.");
    }
  };

  const updateUserDetails = async (id: string, updatedDetails: Partial<User>) => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedDetails),
      });

      if (!response.ok) throw new Error(`Failed to update user details: ${response.statusText}`);

      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === id ? { ...u, ...updatedDetails } : u))
      );
    } catch (err: any) {
      setError(err.message || "Error updating user details.");
    }
  };

  return (
    <DashboardLayout role="admin">
      <div className="p-6 text-white">
        <h2 className="text-2xl font-bold mb-4">User Management</h2>

        {loading && <div className="text-gray-400">Loading users...</div>}
        {error && <div className="text-red-500 p-4">{error}</div>}
        {!loading && !users.length && <div className="text-gray-400">No users found.</div>}

        {users.length > 0 && (
          <UsersTable
            users={users}
            toggleUserStatus={toggleUserStatus}
            handleLoginAsUser={handleLoginAsUser}
            updateUserRole={updateUserRole} // ✅ Fixed: Added missing prop
            deleteUser={deleteUser} // ✅ Fixed: Added missing prop
            updateUserDetails={updateUserDetails} // ✅ Fixed: Added missing prop
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default UsersPage;
