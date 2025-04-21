"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Spinner from "../../components/ui/Spinner";

interface EditShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  shopData: {
    id: string;
    name: string;
    description: string;
    type: "local_shop" | "grocery_shop"; 
    vendorId: string;
  };
  onSave: (updatedShop: { name: string; description: string; type: "local_shop" | "grocery_shop" }) => void;
  isUpdating?: boolean;
}

const EditShopModal: React.FC<EditShopModalProps> = ({ 
  isOpen, 
  onClose, 
  shopData, 
  onSave, 
  isUpdating 
}) => {
  const [shop, setShop] = useState(shopData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setShop(shopData);
    }
  }, [isOpen, shopData]);

  if (!isOpen) return null;

  const handleSave = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/shops/${shop.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: shop.name,
          description: shop.description,
          type: shop.type,
          vendorId: shop.vendorId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to update shop");
      }

      onSave({
        name: shop.name,
        description: shop.description,
        type: shop.type
      });
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-800 p-6 rounded-lg w-96">
        <h2 className="text-xl font-semibold text-white mb-4">Edit Shop Details</h2>

        {error && <p className="text-red-500 mb-3">{error}</p>}

        <div className="flex justify-center mb-4">
          <Image src="/images/next-door1.jpg" alt="Shop Logo" width={64} height={64} className="rounded-full" />
        </div>

        <label className="text-gray-400 block mb-1">Shop Name</label>
        <input
          type="text"
          value={shop.name}
          onChange={(e) => setShop({ ...shop, name: e.target.value })}
          className="w-full p-2 mb-3 bg-gray-700 text-white rounded-md"
          placeholder="Enter shop name"
        />

        <label htmlFor="shop-type" className="text-gray-400 block mb-1">Category</label>
        <select
          id="shop-type"
          value={shop.type}
          onChange={(e) => setShop({ ...shop, type: e.target.value as "local_shop" | "grocery_shop" })}
          className="w-full p-2 mb-3 bg-gray-700 text-white rounded-md"
        >
          <option value="local_shop">Local Shop</option>
          <option value="grocery_shop">Grocery Shop</option>
        </select>

        <label className="text-gray-400 block mb-1">Description</label>
        <textarea
          value={shop.description}
          onChange={(e) => setShop({ ...shop, description: e.target.value })}
          className="w-full p-2 mb-3 bg-gray-700 text-white rounded-md"
          rows={3}
          placeholder="Enter shop description"
        ></textarea>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="bg-gray-600 text-white px-4 py-2 rounded-md">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isUpdating}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            {isUpdating ? (
              <>
                <span>Updating</span>
                <Spinner />
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditShopModal;