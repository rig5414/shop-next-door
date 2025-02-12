"use client";

import SalesDayCard from "./SalesDayCard";
import OrdersList from "./OrdersList";
import RepeatCustomers from "./RepeatCustomer";
import RevenueBreakdown from "./RevenueBreakdown";

const InsightsDetails = () => {
  const insights = {
    highestSalesDay: { day: "Monday", products: "Laptops, Phones", quantity: 15, shop: "Tech Store", time: "2:30 PM" },
    lowestSalesDay: { day: "Sunday", products: "Headphones", quantity: 3, shop: "Gadget Hub", time: "6:00 PM" },
    repeatCustomers: [
      { name: "John Doe", purchases: "4 Phones", shop: "Mobile Mart" },
      { name: "Alice Smith", purchases: "3 Laptops", shop: "Tech Store" },
    ],
    pendingOrders: [
      { orderId: "001", customer: "David Brown", items: "2 Keyboards", status: "Pending" },
      { orderId: "002", customer: "Emma Wilson", items: "1 Monitor", status: "Pending" },
    ],
    completedOrders: [
      { orderId: "101", customer: "Chris Evans", items: "1 Laptop", status: "Completed" },
      { orderId: "102", customer: "Sophia Lee", items: "5 Phones", status: "Completed" },
    ],
    totalRevenue: {
      electronics: "$5,000",
      fashion: "$2,500",
      groceries: "$1,200",
    },
  };

  return (
    <div className="mt-8 bg-gray-900 p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Detailed Business Insights</h3>
        <div className="space-x-3">
          <button onClick={() => window.print()} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg">
            Print Report
          </button>
          <button onClick={() => alert("Share functionality coming soon!")} className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg">
            Share Report
          </button>
        </div>
      </div>

      {/* Grid layout for insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SalesDayCard title="Highest Sales Day" data={insights.highestSalesDay} />
        <SalesDayCard title="Lowest Sales Day" data={insights.lowestSalesDay} />
        <RepeatCustomers data={insights.repeatCustomers} />
        <OrdersList title="Pending Orders" data={insights.pendingOrders} />
        <OrdersList title="Completed Orders" data={insights.completedOrders} />
        <RevenueBreakdown data={insights.totalRevenue} />
      </div>
    </div>
  );
};

export default InsightsDetails;
