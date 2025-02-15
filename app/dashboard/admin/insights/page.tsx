"use client";

import DashboardLayout from "../../../../components/layout/DashboardLayout";
import SalesChart from "../../../../components/dashboard/charts/SalesChart";
import BestSellingChart from "../../../../components/dashboard/charts/BestSellingChart";
import RevenueChart from "../../../../components/dashboard/charts/RevenueChart";
import OrdersChart from "../../../../components/dashboard/charts/OrdersChart";
import CustomerFrequencyChart from "../../../../components/dashboard/charts/CustomerFrequencyChart";
import InsightsDetails from "../../../../components/dashboard/insights/InsightDetails";

const Insights = () => {
  return (
    <DashboardLayout role="admin">
      <div className="p-6 print:w-full print:ml-0 print:bg-white print:px-0">
        <h2 className="text-2xl font-bold mb-4">Admin Insights</h2>

        {/* Grid Layout for Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6 print:grid-cols-2 print:gap-4">
          {[
            { title: "Sales Performance", Component: SalesChart },
            { title: "Best-Selling Products", Component: BestSellingChart },
            { title: "Revenue Breakdown", Component: RevenueChart },
            { title: "Order Status", Component: OrdersChart },
            { title: "Customer Purchase Frequency", Component: CustomerFrequencyChart },
          ].map(({ title, Component }, index) => (
            <div key={index} className="bg-gray-900 p-4 rounded-lg shadow-lg min-h-[250px] flex flex-col print:bg-white print:text-black print:shadow-none print:border print:border-gray-300">
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

      {/* Completely Hide Sidebar on Print */}
      <style jsx global>{`
        @media print {
          .sidebar, nav, header, footer, .dashboard-sidebar {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            position: absolute !important;
            left: -9999px !important;
            width: 0 !important;
            height: 0 !important;
          }

          main {
            margin-left: 0 !important;
            width: 100% !important;
            padding: 0 !important;
          }

          body {
            background: white !important;
            color: black !important;
          }
        }
      `}</style>
    </DashboardLayout>
  );
};

export default Insights;
