"use client";

import { useState } from "react";
import UserRoleDropdown from "../../../../../components/settings/UserRoleDropdown";
import UserActions from "../../../../../components/settings/UserActions";
import DashboardLayout from "../../../../../components/layout/DashboardLayout";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Suspended";
}

interface UsersTableProps {
  users: User[];
  toggleUserStatus: (id: string) => void;
  handleLoginAsUser: (id: string) => void;
  updateUserRole: (id: string, role: string) => void;
  handleEditUser: (id: string) => void;
  handleDeleteUser: (id: string) => void;
}

const UsersTable: React.FC<UsersTableProps> = ({
  users,
  toggleUserStatus,
  handleLoginAsUser,
  updateUserRole,
  handleEditUser,
  handleDeleteUser,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = (users ?? []).filter(
    (user) => user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout role="admin">
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg text-white">
      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 bg-gray-700 rounded-md text-white w-full"
        />
      </div>

      {/* Users Table */}
      <table className="w-full">
        <thead>
          <tr className="text-left border-b border-gray-600">
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Role</th>
            <th className="p-2">Status</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id} className="border-b border-gray-700">
              <td className="p-2">{user.name}</td>
              <td className="p-2">{user.email}</td>
              <td className="p-2">
                <UserRoleDropdown role={user.role} onRoleChange={(newRole) => updateUserRole(user.id, newRole)} />
              </td>
              <td className={`p-2 ${user.status === "Active" ? "text-green-400" : "text-red-400"}`}>{user.status}</td>
              <td className="p-2">
                <UserActions
                  onEdit={() => handleEditUser(user.id)}
                  onSuspend={() => toggleUserStatus(user.id)}
                  onDelete={() => handleDeleteUser(user.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </DashboardLayout>
  );
};

export default UsersTable;
