"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "../../../../components/layout/DashboardLayout";
import { FiSearch, FiShoppingBag, FiFilter } from "react-icons/fi";
import Link from "next/link";

// Mock shop data
const shopCategories = ["All", "Groceries", "Electronics", "Fashion"];
const shopsData = [
  { id: 1, name: "FreshMart", category: "Groceries", isOpen: true, description: "Fresh groceries & organic products." },
  { id: 2, name: "TechHub", category: "Electronics", isOpen: true, description: "Latest gadgets & accessories." },
  { id: 3, name: "Fashion Avenue", category: "Fashion", isOpen: false, description: "Trendy clothes & accessories." },
];

const ShopsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredShops, setFilteredShops] = useState(shopsData);

  useEffect(() => {
    let filtered = shopsData.filter(
      (shop) =>
        (selectedCategory === "All" || shop.category === selectedCategory) &&
        shop.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredShops(filtered);
  }, [searchTerm, selectedCategory]);

  return (
    <DashboardLayout role="customer">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-white">Browse Shops</h1>
        {/* Search Bar */}
        <div className="relative w-full md:w-1/3 mt-4 md:mt-0">
          <input
            type="text"
            placeholder="Search for shops..."
            className="w-full p-2 pl-10 rounded-lg bg-gray-800 text-white outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        {shopCategories.map((category) => (
          <button
            key={category}
            className={`px-4 py-2 rounded-md ${
              selectedCategory === category ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-300"
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Shop Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredShops.map((shop) => (
          <Link
            key={shop.id}
            href={`/shop/${shop.id}`}
            className="block bg-gray-900 p-4 rounded-lg hover:bg-gray-700 transition"
          >
            <div className="flex items-center">
              <FiShoppingBag className="text-blue-400 w-6 h-6 mr-3" />
              <div>
                <h2 className="text-lg font-medium text-white">{shop.name}</h2>
                <p className="text-sm text-gray-400">{shop.description}</p>
                <span
                  className={`text-xs font-semibold ${
                    shop.isOpen ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {shop.isOpen ? "Open" : "Closed"}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default ShopsPage;
