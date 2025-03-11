"use client";

import { useState } from "react";
import Link from "next/link";
import { FiEdit, FiLock, FiUserX, FiLogIn, FiTrash2, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import UserRoleDropdown from "../settings/UserRoleDropdown";
import bcrypt from "bcryptjs";

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
  deleteUser: (id: string) => void;
  updateUserDetails: (id: string, updatedUser: Partial<User>) => void;
}

const UsersTable: React.FC<UsersTableProps> = ({ users, toggleUserStatus, handleLoginAsUser, updateUserRole, updateUserDetails, deleteUser }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const usersPerPage = 5;

// Open edit modal
const openEditModal = (user: User) => {
  const [fName, lName] = user.name.split(" ");
  setEditUser(user);
  setFirstName(fName || "");
  setLastName(lName || "");
  setEmail(user.email);
  setRole(user.role);
  setShowModal(true);
};

// Handle update user
const handleUpdateUser = async () => {
  if (!editUser) return;
  const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

  const updatedUser: Partial<User> = {
    name: `${firstName} ${lastName}`,
    email,
    role,
    ...(hashedPassword && { password: hashedPassword }),
  };

  updateUserDetails(editUser.id, updatedUser);
  setShowModal(false);
};

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

  // Handle delete confirmation
  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setShowModal(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      deleteUser(userToDelete.id);
      setShowModal(false);
      setUserToDelete(null);
    }
  };

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
          <option value="editor">Vendor</option>
          <option value="user">Customer</option>
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
                <UserRoleDropdown
                  role={user.role}
                  onRoleChange={(newRole) => updateUserRole(user.id, newRole)}
                />
              </td>
              <td className={`p-2 ${user.status === "Active" ? "text-green-400" : "text-red-400"}`}>
                {user.status}
              </td>
              <td className="p-2 flex space-x-3">
              <button onClick={() => openEditModal(user)} className="text-blue-400 hover:text-blue-300" title="Edit User" aria-label={`Edit ${user.name}`}>
                  <FiEdit size={18} />
                </button>

                <button onClick={() => toggleUserStatus(user.id)} className="text-yellow-400 hover:text-yellow-300"
                  title={user.status === "Active" ? "Suspend User" : "Activate User"}
                  aria-label={user.status === "Active" ? `Suspend ${user.name}` : `Activate ${user.name}`}
                >
                  {user.status === "Active" ? <FiUserX size={18} /> : <FiLock size={18} />}
                </button>

                <button onClick={() => handleLoginAsUser(user.id)} className="text-green-400 hover:text-green-300" title="Log In As User" aria-label={`Log in as ${user.name}`}>
                  <FiLogIn size={18} />
                </button>

                <button onClick={() => handleDeleteClick(user)} className="text-red-500 hover:text-red-400" title="Delete User" aria-label={`Delete ${user.name}`}>
                  <FiTrash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit User Modal */}
      {showModal && editUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white">
            <h3 className="text-lg font-bold mb-4">Edit User</h3>
            <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="block w-full p-2 mb-2 bg-gray-700 rounded-md text-white" />
            <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} className="block w-full p-2 mb-2 bg-gray-700 rounded-md text-white" />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="block w-full p-2 mb-2 bg-gray-700 rounded-md text-white" />
            <input type="password" placeholder="New Password (Optional)" value={password} onChange={(e) => setPassword(e.target.value)} className="block w-full p-2 mb-2 bg-gray-700 rounded-md text-white" />
            <UserRoleDropdown role={role} onRoleChange={setRole} />

            <div className="flex justify-end space-x-3 mt-4">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-600 rounded-lg">Cancel</button>
              <button onClick={handleUpdateUser} className="px-4 py-2 bg-blue-600 rounded-lg">Update</button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-600 rounded-lg disabled:opacity-50"
          title="Previous Page"
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
          title="Next Page"
          aria-label="Go to next page"
        >
          <FiChevronRight />
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showModal && userToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white">
            <p>Are you sure you want to delete {userToDelete.name}?</p>
            <div className="flex justify-end space-x-3 mt-4">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-600 rounded-lg">Cancel</button>
              <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 rounded-lg">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersTable;
