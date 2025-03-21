import { RevenueData } from "./interface";

interface RevenueBreakdownProps {
  data: RevenueData;
}

const RevenueBreakdown: React.FC<RevenueBreakdownProps> = ({ data }) => {
  if (!data || Object.keys(data).length === 0) {
    return <div className="text-gray-400 text-sm">No revenue data available.</div>;
  }

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md">
      <h4 className="text-lg font-semibold text-white mb-3">Total Revenue Breakdown</h4>
      <ul className="text-gray-300 space-y-2">
        {Object.entries(data).map(([category, amount], index) => (
          <li key={index} className="border-b border-gray-700 pb-2">
            <span className="font-semibold">
              {category?.charAt(0)?.toUpperCase() + category?.slice(1)}
            </span>
            : KES {amount.toLocaleString()} {/* Format with commas */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RevenueBreakdown;
