"use client";

import { useState, useEffect } from "react";

interface UserRoleDropdownProps {
  role: string;
  onRoleChange: (newRole: string) => void;
}

const roles = ["admin", "vendor", "customer"];

const UserRoleDropdown: React.FC<UserRoleDropdownProps> = ({ role, onRoleChange }) => {
  const [selectedRole, setSelectedRole] = useState(role.toLowerCase());

  useEffect(() => {
    setSelectedRole(role.toLowerCase());
  }, [role]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = event.target.value.toLowerCase();
    if (newRole !== selectedRole) {
      setSelectedRole(newRole);
      onRoleChange(newRole);
    }
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
          {r.charAt(0).toUpperCase() + r.slice(1)}
        </option>
      ))}
    </select>
  );
};

export default UserRoleDropdown;
