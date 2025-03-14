"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "../../../../components/layout/DashboardLayout";
import { FiSearch, FiShoppingBag } from "react-icons/fi";
import Link from "next/link";

type Shop = {
  id: string;
  name: string;
  description: string;
  type: "local_shop" | "grocery_shop";
  status: "active" | "inactive";
};

const shopTypes = ["All", "Local Shops", "Grocery Shops"];

const ShopsPage = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("All");
  const [filteredShops, setFilteredShops] = useState<Shop[]>([]);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await fetch("/api/shops");
        if (!response.ok) throw new Error("Failed to fetch shops");
        const data: Shop[] = await response.json();
        console.log("Fetched Shops:", data);
        data.forEach(shop => {
          console.log(`Shop ID: ${shop.id}, Name: ${shop.name}, Type: ${shop.type}, Status: ${shop.status}`);
      });
        setShops(data);
      } catch (error) {
        console.error("Error fetching shops:", error);
      }
    };

    fetchShops();
  }, []);

  useEffect(() => {
    console.log("Selected Type:", selectedType);

    let shopTypeFilter: string | null = null;
    if (selectedType === "Local Shops") {
      shopTypeFilter = "local_shop";
    } else if (selectedType === "Grocery Shops") {
      shopTypeFilter = "grocery_shop";
    }

    console.log("Shop Type Filter:", shopTypeFilter);

    const filtered = shops.filter((shop) => {
      console.log(`Checking shop: ${shop.name} | Type: ${shop.type}`);
      
      const nameMatch = shop.name.toLowerCase().includes(searchTerm.toLowerCase());
      const typeMatch = shopTypeFilter === null || shop.type === shopTypeFilter;
      
      console.log(`Name Match: ${nameMatch}, Type Match: ${typeMatch}`);
      
      return nameMatch && typeMatch;
    });

    console.log("Filtered Shops:", filtered);
    setFilteredShops(filtered);
  }, [searchTerm, selectedType, shops]);

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
        {shopTypes.map((type) => (
          <button
            key={type}
            className={`px-4 py-2 rounded-md ${
              selectedType === type ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-300"
            }`}
            onClick={() => setSelectedType(type)}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Shop Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredShops.length > 0 ? (
          filteredShops.map((shop) => (
            <Link
              key={shop.id}
              href={`/dashboard/customer/shops/${shop.id}`}
              className="block bg-gray-900 p-4 rounded-lg hover:bg-gray-700 transition"
            >
              <div className="flex items-center">
                <FiShoppingBag className="text-blue-400 w-6 h-6 mr-3" />
                <div>
                  <h2 className="text-lg font-medium text-white">{shop.name}</h2>
                  <p className="text-sm text-gray-400">{shop.description}</p>
                  <span
                    className={`text-xs font-semibold ${
                      shop.status === "active" ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {shop.status === "active" ? "Open" : "Closed"}
                  </span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-3 text-center py-8 text-gray-400">
            No shops found matching your criteria.
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ShopsPage;