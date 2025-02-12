"use client";

import { useState } from "react";
import Sidebar from "../../../../components/layout/Sidebar";
import SalesChart from "../../../../components/dashboard/charts/SalesChart";
import BestSellingChart from "../../../../components/dashboard/charts/BestSellingChart";
import RevenueChart from "../../../../components/dashboard/charts/RevenueChart";
import OrdersChart from "../../../../components/dashboard/charts/OrdersChart";
import CustomerFrequencyChart from "../../../../components/dashboard/charts/CustomerFrequencyChart";
import InsightsDetails from "../../../../components/dashboard/insights/InsightDetails";

const Insights = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex">
      {/* Sidebar (Hidden in Print) */}
      <div className="print:hidden">
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} role="admin" />
      </div>

      {/* Main Content */}
      <div
        className={`p-6 transition-all duration-300 print:w-full ${
          isCollapsed ? "ml-20 w-[calc(100%-5rem)]" : "ml-64 w-[calc(100%-16rem)]"
        }`}
      >
        <h2 className="text-2xl font-bold mb-4">Admin Insights</h2>

        {/* Grid Layout for Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {[
            { title: "Sales Performance", Component: SalesChart },
            { title: "Best-Selling Products", Component: BestSellingChart },
            { title: "Revenue Breakdown", Component: RevenueChart },
            { title: "Order Status", Component: OrdersChart },
            { title: "Customer Purchase Frequency", Component: CustomerFrequencyChart },
          ].map(({ title, Component }, index) => (
            <div key={index} className="bg-gray-900 p-4 rounded-lg shadow-lg min-h-[250px] flex flex-col">
              <h3 className="text-lg font-semibold mb-2">{title}</h3>
              <div className="flex-grow">
                <Component />
              </div>
            </div>
          ))}
        </div>

        {/* Insights Details (Includes Print Report Button) */}
        <InsightsDetails />
      </div>
    </div>
  );
};

export default Insights;
