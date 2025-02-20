"use client";

import { useState } from "react";

interface EditShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  shopData: {
    name: string;
    description: string;
    category: string;
    logo: string;
  };
  onSave: (updatedShop: { name: string; description: string; category: string; logo: string }) => void;
}

const EditShopModal: React.FC<EditShopModalProps> = ({ isOpen, onClose, shopData, onSave }) => {
  const [shop, setShop] = useState(shopData);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-800 p-6 rounded-lg w-96">
        <h2 className="text-xl font-semibold text-white mb-4">Edit Shop Details</h2>

        {/* Shop Name */}
        <label className="text-gray-400 block mb-1">Shop Name</label>
        <input
          type="text"
          value={shop.name}
          onChange={(e) => setShop({ ...shop, name: e.target.value })}
          className="w-full p-2 mb-3 bg-gray-700 text-white rounded-md"
          placeholder="Enter shop name"
        />

        {/* Shop Category */}
        <label className="text-gray-400 block mb-1">Category</label>
        <input
          type="text"
          value={shop.category}
          onChange={(e) => setShop({ ...shop, category: e.target.value })}
          className="w-full p-2 mb-3 bg-gray-700 text-white rounded-md"
          placeholder="Enter category"
        />

        {/* Shop Description */}
        <label className="text-gray-400 block mb-1">Description</label>
        <textarea
          value={shop.description}
          onChange={(e) => setShop({ ...shop, description: e.target.value })}
          className="w-full p-2 mb-3 bg-gray-700 text-white rounded-md"
          rows={3}
          placeholder="Enter shop description"
        ></textarea>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="bg-gray-600 text-white px-4 py-2 rounded-md">
            Cancel
          </button>
          <button
            onClick={() => {
              onSave(shop);
              onClose();
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditShopModal;
