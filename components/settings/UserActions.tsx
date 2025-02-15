"use client";

import { FiEdit, FiUserX, FiTrash2, FiMoreVertical } from "react-icons/fi";
import { useState } from "react";

interface UserActionsProps {
  onEdit: () => void;
  onSuspend: () => void;
  onDelete: () => void;
}

const UserActions: React.FC<UserActionsProps> = ({ onEdit, onSuspend, onDelete }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="p-2 text-gray-300 hover:text-white" title="Open actions menu" aria-label="Open sctions menu">
        <FiMoreVertical size={18} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-32 bg-gray-700 text-white rounded-lg shadow-lg">
          <button onClick={onEdit} className="flex items-center px-4 py-2 hover:bg-gray-600 w-full">
            <FiEdit className="mr-2" /> Edit
          </button>
          <button onClick={onSuspend} className="flex items-center px-4 py-2 hover:bg-gray-600 w-full">
            <FiUserX className="mr-2" /> Suspend
          </button>
          <button onClick={onDelete} className="flex items-center px-4 py-2 hover:bg-red-600 w-full text-red-400">
            <FiTrash2 className="mr-2" /> Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default UserActions;
