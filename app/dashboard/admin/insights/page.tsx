"use client";

import DashboardLayout from "../../../../components/layout/DashboardLayout";
import BestSellingChart from "../../../../components/dashboard/charts/BestSellingChart";
import RevenueChart from "../../../../components/dashboard/charts/RevenueChart";
import OrdersChart from "../../../../components/dashboard/charts/OrdersChart";
import CustomerFrequencyChart from "../../../../components/dashboard/charts/CustomerFrequencyChart";
import SalesChart from "../../../../components/dashboard/charts/SalesChart";
import InsightsDetails from "../../../../components/dashboard/insights/InsightDetails";
import OrdersList from "../../../../components/dashboard/insights/OrdersList";
import RepeatCustomers from "../../../../components/dashboard/insights/RepeatCustomer";
import RevenueBreakdown from "../../../../components/dashboard/insights/RevenueBreakdown";
import SalesDayCard from "../../../../components/dashboard/insights/SalesDayCard";
import ErrorBoundary from "../../../../components/auth/ErrorBoundary";
import { fetchInsights } from "../../../../lib/fetchInsights";
import { useEffect, useState } from "react";
import Spinner from "../../../../components/ui/Spinner";

const Insights = () => {
  const [insightsData, setInsightsData] = useState<any | null>(null);

  useEffect(() => {
    async function fetchData() {
      const data = await fetchInsights();
      setInsightsData(data);
    }
    fetchData();
  }, []);

  // Updated debugging code with TypeScript fixes
  useEffect(() => {
    console.log('Debugging Chart.js controller error...');

    if (typeof window !== 'undefined') {
      // Use type assertion to tell TypeScript that Chart might exist on window
      const windowWithChart = window as any;

      // Check if Chart.js is available
      console.log('Chart.js available:', typeof windowWithChart.Chart !== 'undefined');

      // If Chart.js is available, check registered controllers
      if (windowWithChart.Chart) {
        console.log('Chart.js version:', windowWithChart.Chart.version);

        // Check if the registry exists
        if (windowWithChart.Chart.registry) {
          console.log('Chart.js registry exists');

          // Check if controllers exist in the registry
          if (windowWithChart.Chart.registry.controllers) {
            const controllers = Object.keys(windowWithChart.Chart.registry.controllers);
            console.log('Registered controllers:', controllers);
            console.log('Bar controller registered:', controllers.includes('bar'));
          } else {
            console.log('No controllers in registry');
          }
        } else {
          console.log('No registry in Chart.js');
        }
      } else {
        console.log('Chart.js not available on window');
      }
    } else {
      console.log('window is undefined');
    }
  }, []);

  if (!insightsData) {
    return <p className="text-white text-center">Loading insights...</p>;
  }

  const transformedOrders = insightsData.orders?.map((order: any) => ({
    customerName: order.customerName || "Unknown Customer",
    items: order.items || [],
    status: order.status || "Unknown",
  })) || [];

  return (
    <DashboardLayout role="admin">
      <div className="p-6 print:w-full print:ml-0 print:bg-white print:px-0">
        <h2 className="text-2xl font-bold mb-6">Admin Insights</h2>

        {/* Chart Grid - Using auto-fit for responsive layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr mb-8">
          {[
            { title: "Best-Selling Products", Component: BestSellingChart },
            { title: "Sales Overview", Component: SalesChart },
            { title: "Revenue Breakdown", Component: RevenueChart },
            { title: "Order Status", Component: OrdersChart },
            { title: "Customer Purchase Frequency", Component: CustomerFrequencyChart },
          ].map(({ title, Component }, index) => (
            <div
              key={index}
              className="h-[400px] bg-gray-900 rounded-lg shadow-lg overflow-hidden"
            >
              <ErrorBoundary>
              <Component />
              </ErrorBoundary>
            </div>
          ))}
        </div>

        {/* Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {insightsData?.customers && <RepeatCustomers data={insightsData.customers} />}
          {insightsData?.revenue && <RevenueBreakdown data={insightsData.revenue} />}
        </div>

        <InsightsDetails data={insightsData}/>
      </div>

      {/* Existing print styles */}
      <style jsx global>
        {`
          @media print {
            .sidebar,
            nav,
            header,
            footer,
            .dashboard-sidebar {
              visibility: hidden !important;
              opacity: 0 !important;
              width: 0 !important;
              height: 0 !important;
              display: none !important;
              position: absolute !important;
              left: -9999px !important;
            }
            main {
              width: 100% !important;
              margin-left: 0 !important;
              padding: 0 !important;
            }
            body {
              color: #000 !important;
              background: #fff !important;
            }
          }
        `}
      </style>
    </DashboardLayout>
  );
};

export default Insights;