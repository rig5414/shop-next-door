"use client";

import { useEffect, useState } from "react";
import SalesDayCard from "./SalesDayCard";
import OrdersList from "./OrdersList";
import RepeatCustomers from "./RepeatCustomer";
import RevenueBreakdown from "./RevenueBreakdown";
import { fetchInsights } from "../../../lib/fetchInsights";
import { Insights, SalesData, OrderData, CustomerData, RevenueData } from "./interface"; // Import interfaces

const InsightsDetails = () => {
  const [insights, setInsights] = useState<Insights | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchInsights();
        if (!data) throw new Error("No insights data received.");
        setInsights(data);
      } catch (error) {
        console.error("Error fetching insights:", error);
        setError("Failed to load insights. Please try again later.");
      }
    }

    fetchData();
  }, []);

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  if (!insights) {
    return <p className="text-white text-center">Loading insights...</p>;
  }

  return (
    <div className="mt-8 bg-gray-900 p-6 rounded-lg shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {insights.sales?.map((sale, index) => (
          <SalesDayCard
            key={index}
            title={`Sales on ${sale.day}`}
            data={{
              ...sale,
              products: sale.products?.toString() || "0", // Add optional chaining and default
            }}
          />
        ))}
        {insights.customers?.length > 0 && <RepeatCustomers data={insights.customers} />}
        {insights.orders?.length > 0 && (
          <OrdersList
            title="Order Status"
            data={insights.orders.map((order) => ({
              ...order,
              items: Array(order.items).fill({ productName: "Unknown", quantity: 1 }),
            }))}
          />
        )}
        {insights.revenue?.length > 0 && <RevenueBreakdown data={insights.revenue[0]} />}
      </div>
    </div>
  );
};

export default InsightsDetails;