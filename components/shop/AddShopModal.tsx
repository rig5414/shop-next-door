"use client";

import { useState, useEffect } from "react";
import { X } from 'lucide-react'; // Assuming you're using Lucide icons

interface User {
  id: string;
  name: string;
  role: string;
}

interface AddShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void; // To refresh the vendors list after adding a shop
}

const AddShopModal = ({ isOpen, onClose, onSuccess }: AddShopModalProps) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [vendors, setVendors] = useState<User[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [shopData, setShopData] = useState({
    name: "",
    description: "",
    type: "local_shop" as "local_shop" | "grocery_shop",
  });

  // Fetch vendors without shops
  useEffect(() => {
    if (isOpen) {
      fetchVendorsWithoutShops();
    }
  }, [isOpen]);

  const fetchVendorsWithoutShops = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all users and shops
      const [usersRes, shopsRes] = await Promise.all([
        fetch("/api/users"),
        fetch("/api/shops"),
      ]);

      if (!usersRes.ok || !shopsRes.ok) {
        throw new Error("Failed to fetch data");
      }

      const [usersData, shopsData] = await Promise.all([
        usersRes.json(),
        shopsRes.json(),
      ]);

      // Filter vendors without shops
      const vendorUsers = usersData.filter((user: User) => user.role === "vendor");
      const vendorsWithShops = shopsData.map((shop: any) => shop.vendorId);
      
      const availableVendors = vendorUsers.filter(
        (vendor: User) => !vendorsWithShops.includes(vendor.id)
      );

      setVendors(availableVendors);
    } catch (err) {
      console.error("Fetch Vendors Error:", err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectVendor = (vendor: User) => {
    setSelectedVendor(vendor);
    setStep(2);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShopData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedVendor) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch("/api/shops", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: shopData.name,
          description: shopData.description,
          vendorId: selectedVendor.id,
          type: shopData.type,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create shop");
      }

      // Reset form and close modal
      setShopData({
        name: "",
        description: "",
        type: "local_shop",
      });
      setSelectedVendor(null);
      setStep(1);
      onSuccess(); // Refresh the vendors list
      onClose();
    } catch (err) {
      console.error("Create Shop Error:", err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setStep(1);
    setSelectedVendor(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">
            {step === 1 ? "Select Vendor" : "Create Shop"}
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white"
            aria-label="Save Changes"
            >
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-500 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        {step === 1 ? (
          <div>
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : vendors.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No vendors available without shops</p>
            ) : (
              <div className="max-h-96 overflow-y-auto">
                {vendors.map((vendor) => (
                  <div
                    key={vendor.id}
                    onClick={() => handleSelectVendor(vendor)}
                    className="p-4 border border-gray-700 rounded-lg mb-2 cursor-pointer hover:bg-gray-700"
                  >
                    <p className="text-white font-medium">{vendor.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <p className="text-gray-400 mb-2">Creating shop for: <span className="text-white">{selectedVendor?.name}</span></p>
            </div>
            
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-400 mb-1">Shop Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={shopData.name}
                onChange={handleInputChange}
                required
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="description" className="block text-gray-400 mb-1">Description</label>
              <textarea
                id="description"
                name="description"
                value={shopData.description}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="type" className="block text-gray-400 mb-1">Shop Type</label>
              <select
                id="type"
                name="type"
                value={shopData.type}
                onChange={handleInputChange}
                required
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
              >
                <option value="local_shop">Local Shop</option>
                <option value="grocery_shop">Grocery Shop</option>
              </select>
            </div>
            
            <div className="flex justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Shop"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddShopModal;