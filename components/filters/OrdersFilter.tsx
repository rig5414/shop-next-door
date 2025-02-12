import React, { useState } from "react";

const OrdersFilter = ({ onFilterChange }: { onFilterChange: (filters: any) => void }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [shop, setShop] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  // Handles filter changes
  const handleFilterChange = () => {
    onFilterChange({
      searchQuery,
      orderStatus,
      paymentStatus,
      shop,
      dateRange,
    });
  };

  // Resets all filters
  const resetFilters = () => {
    setSearchQuery("");
    setOrderStatus("");
    setPaymentStatus("");
    setShop("");
    setDateRange({ start: "", end: "" });
    onFilterChange({});
  };

  return (
    <div className="bg-gray-900 text-white p-4 rounded-lg shadow-md flex flex-wrap gap-4">
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search orders..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="bg-gray-800 text-white px-3 py-2 rounded-lg w-56"
      />

      {/* Order Status Dropdown */}
      <select
        aria-label="Order Status"
        value={orderStatus}
        onChange={(e) => setOrderStatus(e.target.value)}
        className="bg-gray-800 text-white px-3 py-2 rounded-lg"
      >
        <option value="">All Statuses</option>
        <option value="Pending">Pending</option>
        <option value="Processing">Processing</option>
        <option value="Completed">Completed</option>
        <option value="Cancelled">Cancelled</option>
      </select>

      {/* Payment Status Dropdown */}
      <select
        aria-label="Payment Status"
        value={paymentStatus}
        onChange={(e) => setPaymentStatus(e.target.value)}
        className="bg-gray-800 text-white px-3 py-2 rounded-lg"
      >
        <option value="">All Payments</option>
        <option value="Paid">Paid</option>
        <option value="Pending">Pending</option>
        <option value="Failed">Failed</option>
      </select>

      {/* Vendor/Shop Dropdown */}
      <select
        aria-label="Shop Name"
        value={shop}
        onChange={(e) => setShop(e.target.value)}
        className="bg-gray-800 text-white px-3 py-2 rounded-lg"
      >
        <option value="">All Shops</option>
        <option value="Shop1">Shop 1</option>
        <option value="Shop2">Shop 2</option>
      </select>

      {/* Reset Button */}
      <button onClick={resetFilters} className="bg-red-500 hover:bg-red-600 px-3 py-2 rounded-lg">
        Reset Filters
      </button>
    </div>
  );
};

export default OrdersFilter;
