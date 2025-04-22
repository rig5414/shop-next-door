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
      <h3 className="text-xl font-bold mb-4 text-white">Detailed Insights</h3>
      
      {/* Sales Section */}
      {data.sales && data.sales.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold mb-3 text-white">Daily Sales Performance</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.sales.map((sale, index) => (
              <SalesDayCard
                key={index}
                title={`${sale.date}`}
                data={{
                  day: sale.date,
                  products: String(sale.total),
                  quantity: sale.completionRate,
                  time: sale.date,
                  shop: "All Shops"
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Orders Section */}
      {data.orders && data.orders.length > 0 && (
        <div className="mb-6">
          <OrdersList
            title="Order Status Breakdown"
            data={data.orders}
          />
        </div>
      )}

      {/* Customers Section */}
      {data.customers && data.customers.length > 0 && (
        <div className="mb-6">
          <RepeatCustomers data={data.customers} />
        </div>
      )}
      
      {/* Revenue Section */}
      {data.revenue && data.revenue.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold mb-3 text-white">Revenue Analysis</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RevenueBreakdown data={data.revenue} />
          </div>
        </div>
      )}
    </div>
  );
};

export default InsightsDetails;