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
  const [users, setUsers] = useState<User[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users");
        if (!response.ok) throw new Error("Failed to fetch users");
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError("Error loading users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const toggleUserStatus = async (id: string) => {
    if (!users) return;
    const user = users.find((user) => user.id === id);
    if (!user) return;

    const updatedStatus = user.status === "Active" ? "Suspended" : "Active";

    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: updatedStatus }),
      });

      if (!response.ok) throw new Error("Failed to update user status");

      setUsers((prevUsers) =>
        prevUsers!.map((u) => (u.id === id ? { ...u, status: updatedStatus } : u))
      );
    } catch (err) {
      alert("Error updating user status.");
    }
  };

  const handleLoginAsUser = async (id: string) => {
    try {
      const response = await fetch(`/api/users/${id}/login-as`, { method: "POST" });

      if (!response.ok) throw new Error("Failed to log in as user");

      alert(`Logged in as user with ID: ${id}`);
    } catch (err) {
      alert("Error logging in as user.");
    }
  };

  return (
    <DashboardLayout role="admin">
      <div className="p-6 text-white">
        <h2 className="text-2xl font-bold mb-4">User Management</h2>

        {loading && <div className="text-gray-400">Loading users...</div>}
        {error && <div className="text-red-500 p-4">{error}</div>}
        {users && users.length > 0 && (
          <UsersTable
            users={users}
            toggleUserStatus={toggleUserStatus}
            handleLoginAsUser={handleLoginAsUser}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default UsersPage;
