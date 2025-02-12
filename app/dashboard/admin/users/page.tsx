"use client";

import { useState, useEffect } from "react";
import UsersTable from "../../../../components/tables/UserTable";

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

console.log("📌 Sample Users (Before State Initialization):", sampleUsers);

const UsersPage = () => {
  const [users, setUsers] = useState<User[] | null>(null);

  // Set initial users after component mounts to prevent hydration issues
  useEffect(() => {
    console.log("✅ Initializing users state...");
    setUsers(sampleUsers);
  }, []);

  useEffect(() => {
    console.log("📌 Users state after update:", users);
  }, [users]);

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
    <div className="p-6 text-white">
      <h2 className="text-2xl font-bold mb-4">User Management</h2>

      {/* Conditional rendering to ensure users is defined before rendering UsersTable */}
      {users && users.length > 0 ? (
        <UsersTable users={users} toggleUserStatus={toggleUserStatus} handleLoginAsUser={handleLoginAsUser} />
      ) : (
        <div className="text-red-500 p-4">Error: Users data is missing</div>
      )}
    </div>
  );
};

export default UsersPage;
