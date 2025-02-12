"use client";

import { useState } from "react";

interface User {
  name: string;
  email: string;
  role: string;
  status: string;
}

interface UserFormProps {
  user: User;
  setUser: (updatedUser: User) => void;
  onSave: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, setUser, onSave }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value }); // ✅ Fixed
  };

  return (
    <div className="p-6 bg-gray-900 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-white">Edit User Details</h2>

      <div className="mt-4 space-y-4">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="text-gray-400">Name:</label>
          <input
            id="name"
            type="text"
            name="name"
            value={user.name}
            onChange={handleChange}
            placeholder="Enter name..."
            aria-label="User name"
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
          />
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="text-gray-400">Email:</label>
          <input
            id="email"
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            placeholder="Enter email..."
            aria-label="User email"
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
          />
        </div>

        {/* Role Dropdown */}
        <div>
          <label htmlFor="role" className="text-gray-400">Role:</label>
          <select
            id="role"
            name="role"
            value={user.role}
            onChange={handleChange}
            aria-label="User role"
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
          >
            <option value="customer">Customer</option>
            <option value="vendor">Vendor</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Status Dropdown */}
        <div>
          <label htmlFor="status" className="text-gray-400">Status:</label>
          <select
            id="status"
            name="status"
            value={user.status}
            onChange={handleChange}
            aria-label="User status"
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
          >
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        {/* Save Button */}
        <button
          onClick={onSave}
          className="mt-4 bg-blue-500 hover:bg-blue-400 text-white py-2 px-4 rounded"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default UserForm;
