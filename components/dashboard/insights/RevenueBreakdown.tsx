import React from "react";
import { RevenueData } from "./interface";

interface RevenueBreakdownProps {
  data: any; // Use 'any' to handle different data structures
}

const RevenueBreakdown: React.FC<RevenueBreakdownProps> = ({ data }) => {
  if (!data) {
    return <div className="text-gray-400 text-sm">No revenue data available.</div>;
  }

  // Case 1: If data has month and revenue properties
  if (data.month !== undefined && data.revenue !== undefined) {
    return (
      <div className="bg-gray-800 p-4 rounded-lg shadow-md">
        <h4 className="text-lg font-semibold text-white mb-3">Revenue Breakdown</h4>
        <div className="text-gray-300 space-y-2">
          <div className="border-b border-gray-700 pb-2">
            <span className="font-semibold">{data.month}</span>
            : KES {typeof data.revenue === 'number' ? data.revenue.toLocaleString() : data.revenue}
          </div>
        </div>
      </div>
    );
  }
  
  // Case 2: If data has category and totalRevenue properties (as per interface)
  if (data.category !== undefined && data.totalRevenue !== undefined) {
    return (
      <div className="bg-gray-800 p-4 rounded-lg shadow-md">
        <h4 className="text-lg font-semibold text-white mb-3">Revenue Breakdown</h4>
        <div className="text-gray-300 space-y-2">
          <div className="border-b border-gray-700 pb-2">
            <span className="font-semibold">
              {typeof data.category === 'string' 
                ? data.category.charAt(0).toUpperCase() + data.category.slice(1) 
                : String(data.category)}
            </span>
            : KES {typeof data.totalRevenue === 'number' ? data.totalRevenue.toLocaleString() : data.totalRevenue}
          </div>
        </div>
      </div>
    );
  }
  
  // Case 3: If data is an object with arbitrary keys (fallback)
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md">
      <h4 className="text-lg font-semibold text-white mb-3">Revenue Breakdown</h4>
      <ul className="text-gray-300 space-y-2">
        {Object.entries(data).map(([key, value], index) => {
          // Skip rendering if value is an object (to prevent the React child error)
          if (typeof value === 'object' && value !== null) {
            return (
              <li key={index} className="border-b border-gray-700 pb-2">
                <span className="font-semibold">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </span>
                : [Complex Data]
              </li>
            );
          }
          
          return (
            <li key={index} className="border-b border-gray-700 pb-2">
              <span className="font-semibold">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </span>
              : {typeof value === 'number' ? `KES ${value.toLocaleString()}` : String(value)}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default RevenueBreakdown;