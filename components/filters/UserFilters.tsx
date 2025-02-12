"use client";

import Link from "next/link";
import { FiEdit, FiLock, FiUserX, FiLogIn } from "react-icons/fi";

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
}

const UsersTable: React.FC<UsersTableProps> = ({ users, toggleUserStatus, handleLoginAsUser }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg text-white">
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
          {users.map((user) => (
            <tr key={user.id} className="border-b border-gray-700">
              <td className="p-2">{user.name}</td>
              <td className="p-2">{user.email}</td>
              <td className="p-2 capitalize">{user.role}</td>
              <td className={`p-2 ${user.status === "Active" ? "text-green-400" : "text-red-400"}`}>
                {user.status}
              </td>
              <td className="p-2 flex space-x-3">
                <Link href={`/dashboard/admin/users/${user.id}`} passHref>
                  <button className="text-blue-400 hover:text-blue-300" title="Edit Credentials" aria-label="Edit Credentials">
                    <FiEdit size={18} />
                  </button>
                </Link>

                <button
                  onClick={() => toggleUserStatus(user.id)}
                  className="text-yellow-400 hover:text-yellow-300"
                  title={user.status === "Active" ? "Suspend User" : "Activate User"}
                  aria-label={user.status === "Active" ? "Suspend User" : "Activate User"}
                >
                  {user.status === "Active" ? <FiUserX size={18} /> : <FiLock size={18} />}
                </button>

                <button
                  onClick={() => handleLoginAsUser(user.id)}
                  className="text-green-400 hover:text-green-300"
                  title="Log in as User"
                  aria-label="Log in as User"
                >
                  <FiLogIn size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
