"use client";

import React from "react";
import SalesDayCard from "./SalesDayCard";
import OrdersList from "./OrdersList";
import RepeatCustomers from "./RepeatCustomer";
import RevenueBreakdown from "./RevenueBreakdown";
import { Insights } from "./interface";

interface InsightsDetailsProps {
  data?: Insights;
}

const InsightsDetails: React.FC<InsightsDetailsProps> = ({ data }) => {
  if (!data) {
    return <p className="text-white text-center">No detailed insights available.</p>;
  }

  return (
    <div className="mt-8 bg-gray-900 p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4">Detailed Insights</h3>
      
      {/* Sales Section */}
{data.sales && data.sales.length > 0 && (
  <div className="mb-6">
    <h4 className="text-lg font-semibold mb-3">Daily Sales Performance</h4>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.sales.map((sale, index) => {
        // Skip rendering if sale doesn't have valid data
        if (!sale || typeof sale !== 'object') {
          return null;
        }
        
        return (
          <SalesDayCard
            key={index}
            title={sale.day ? `Sales on ${sale.day}` : "Daily Sales"}
            data={{
              day: sale.day || `Day ${index + 1}`,
              products: sale.products !== undefined ? String(sale.products) : "0",
              quantity: sale.quantity || 0,
              shop: sale.shop || "Main Store",
              time: sale.time || "N/A"
            }}
          />
        );
      })}
    </div>
  </div>
)}
      
      {/* Orders Section */}
{data.orders && data.orders.length > 0 && (
  <div className="mb-6">
    <h4 className="text-lg font-semibold mb-3">Order Details</h4>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <OrdersList
        title="Recent Orders"
        data={data.orders.map(order => ({
          customerName: order.customerName || "Customer",
          status: order.status || "processing",
          // Create a more descriptive item entry
          items: [{ 
            productName: typeof order.items === 'number' 
              ? `${order.items} product${order.items !== 1 ? 's' : ''}` 
              : "items", 
            quantity: 1 
          }]
        }))}
      />
    </div>
  </div>
)}
      
      {/* Customers Section */}
{data.customers && data.customers.length > 0 && (
  <div className="mb-6">
    <h4 className="text-lg font-semibold mb-3">Customer Insights</h4>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <RepeatCustomers 
        data={data.customers.map(customer => ({
          name: customer.name || "Unknown Customer",
          purchases: customer.purchases || 0,
          shopName: customer.shopName || "Unknown Shop",
          totalOrders: customer.totalOrders
        }))} 
      />
    </div>
  </div>
)}
      
{/* Revenue Section */}
{data.revenue && data.revenue.length > 0 && (
  <div>
    <h4 className="text-lg font-semibold mb-3">Revenue Analysis</h4>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {data.revenue.map((revenueItem, index) => {
        // Skip rendering if revenueItem is not valid
        if (!revenueItem || typeof revenueItem !== 'object') {
          return null;
        }
        return (
          <RevenueBreakdown 
            key={index} 
            data={revenueItem} 
          />
        );
      })}
    </div>
  </div>
)}
    </div>
  );
};

export default InsightsDetails;