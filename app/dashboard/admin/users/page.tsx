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

// Sample users data
const sampleUsers: User[] = [
  { id: "1", name: "John Doe", email: "john@example.com", role: "customer", status: "Active" },
  { id: "2", name: "Alice Smith", email: "alice@example.com", role: "vendor", status: "Active" },
  { id: "3", name: "Bob Johnson", email: "bob@example.com", role: "customer", status: "Suspended" },
];

const UsersPage = () => {
  const [users, setUsers] = useState<User[] | null>(null);

  useEffect(() => {
    setUsers(sampleUsers);
  }, []);

  const toggleUserStatus = (id: string) => {
    if (!users) return;
    setUsers((prevUsers) =>
      prevUsers!.map((user) =>
        user.id === id ? { ...user, status: user.status === "Active" ? "Suspended" : "Active" } : user
      )
    );
  };

  const handleLoginAsUser = (id: string) => {
    alert(`Logged in as user with ID: ${id}`);
  };

  return (
    <DashboardLayout role="admin"> {/* Ensure DashboardLayout is wrapping everything */}
      <div className="p-6 text-white">
        <h2 className="text-2xl font-bold mb-4">User Management</h2>
        {users && users.length > 0 ? (
          <UsersTable users={users} toggleUserStatus={toggleUserStatus} handleLoginAsUser={handleLoginAsUser} />
        ) : (
          <div className="text-red-500 p-4">Error: Users data is missing</div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default UsersPage;
