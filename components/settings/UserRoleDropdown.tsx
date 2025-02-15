"use client";

import { useState } from "react";

interface UserRoleDropdownProps {
  role: string;
  onRoleChange: (newRole: string) => void;
}

const roles = ["Admin", "Vendor", "User"];

const UserRoleDropdown: React.FC<UserRoleDropdownProps> = ({ role, onRoleChange }) => {
  const [selectedRole, setSelectedRole] = useState(role);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = event.target.value;
    setSelectedRole(newRole);
    onRoleChange(newRole);
  };

  return (
    <select
      value={selectedRole}
      onChange={handleChange}
      className="bg-gray-700 text-white px-3 py-1 rounded-md border border-gray-500"
      title="User Role Selection"
      aria-label="User Role Selection"
    >
      {roles.map((r) => (
        <option key={r} value={r}>
          {r}
        </option>
      ))}
    </select>
  );
};

export default UserRoleDropdown;