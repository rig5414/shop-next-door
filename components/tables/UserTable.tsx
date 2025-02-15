"use client";

import { useState } from "react";
import Link from "next/link";
import { FiEdit, FiLock, FiUserX, FiLogIn, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import UserActions from "../settings/UserActions";
import UserRoleDropdown from "../settings/UserRoleDropdown";

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
}

const UsersTable: React.FC<UsersTableProps> = ({ users, toggleUserStatus, handleLoginAsUser, updateUserRole }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  // Filter users based on search and filters
  const filteredUsers = users.filter((user) => {
    return (
      (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (roleFilter ? user.role === roleFilter : true) &&
      (statusFilter ? user.status === statusFilter : true)
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const displayedUsers = filteredUsers.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

  // Handle bulk selection
  const toggleUserSelection = (id: string) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((userId) => userId !== id) : [...prev, id]
    );
  };

  const bulkToggleStatus = () => {
    selectedUsers.forEach((id) => toggleUserStatus(id));
    setSelectedUsers([]);
  };

  const handleRoleChange = (userId: string, event: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = event.target.value;
    updateUserRole(userId, newRole);
  } 


  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg text-white">
      {/* Search and Filter Controls */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search users..."
          aria-label="Search users"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 bg-gray-700 rounded-md text-white w-1/3"
        />

        <select
          aria-label="Filter by role"
          className="p-2 bg-gray-700 rounded-md text-white"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="editor">Editor</option>
          <option value="user">User</option>
        </select>

        <select
          aria-label="Filter by status"
          className="p-2 bg-gray-700 rounded-md text-white"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Suspended">Suspended</option>
        </select>
      </div>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <button
          onClick={bulkToggleStatus}
          className="mb-2 p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
        >
          Toggle Status for Selected Users
        </button>
      )}

      {/* User Table */}
      <table className="w-full">
        <thead>
          <tr className="text-left border-b border-gray-600">
            <th className="p-2">
              <input
                type="checkbox"
                aria-label="Select all users"
                onChange={(e) =>
                  setSelectedUsers(e.target.checked ? displayedUsers.map((u) => u.id) : [])
                }
                checked={selectedUsers.length === displayedUsers.length && selectedUsers.length > 0}
              />
            </th>
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Role</th>
            <th className="p-2">Status</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {displayedUsers.map((user) => (
            <tr key={user.id} className="border-b border-gray-700">
              <td className="p-2">
                <input
                  type="checkbox"
                  aria-label={`Select user ${user.name}`}
                  checked={selectedUsers.includes(user.id)}
                  onChange={() => toggleUserSelection(user.id)}
                />
              </td>
              <td className="p-2">{user.name}</td>
              <td className="p-2">{user.email}</td>
              <td className="p-2">
                {/* Replacing inline select with UserRoleDropdown */}
                <UserRoleDropdown
                  role={user.role}
                  onRoleChange={(newRole) => updateUserRole(user.id, newRole)}
                />
              </td>
              <td className={`p-2 ${user.status === "Active" ? "text-green-400" : "text-red-400"}`}>
                {user.status}
              </td>
              <td className="p-2 flex space-x-3">
                {/* Edit User */}
                <Link href={`/dashboard/admin/users/${user.id}`} className="text-blue-400 hover:text-blue-300" aria-label={`Edit ${user.name}'s details`}>
                  <FiEdit size={18} title="Edit Credentials" />
                </Link>

                {/* Toggle Status */}
                <button
                  onClick={() => toggleUserStatus(user.id)}
                  className="text-yellow-400 hover:text-yellow-300"
                  title={user.status === "Active" ? "Suspend User" : "Activate User"}
                  aria-label={user.status === "Active" ? `Suspend ${user.name}` : `Activate ${user.name}`}
                >
                  {user.status === "Active" ? <FiUserX size={18} /> : <FiLock size={18} />}
                </button>

                {/* Impersonate User */}
                <button
                  onClick={() => handleLoginAsUser(user.id)}
                  className="text-green-400 hover:text-green-300"
                  title="Log in as User"
                  aria-label={`Log in as ${user.name}`}
                >
                  <FiLogIn size={18} />
                </button>

                {/* User Actions */}
                <UserActions
                onEdit={() => console.log(`Editing user: ${user.id}`)}
                onSuspend={() => toggleUserStatus(user.id)}
                onDelete={() => console.log(`Deleting user: ${user.id}`)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-600 rounded-lg disabled:opacity-50"
          aria-label="Go to previous page"
        >
          <FiChevronLeft />
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-600 rounded-lg disabled:opacity-50"
          aria-label="Go to next page"
        >
          <FiChevronRight />
        </button>
      </div>
    </div>
  );
};

export default UsersTable;
