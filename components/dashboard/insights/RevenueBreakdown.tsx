interface RevenueData {
    [category: string]: string; // Each category is a string key with a string value (e.g., "$5000")
  }
  
  interface RevenueBreakdownProps {
    data: RevenueData;
  }
  
  const RevenueBreakdown: React.FC<RevenueBreakdownProps> = ({ data }) => {
    return (
      <div className="bg-gray-800 p-4 rounded-lg">
        <h4 className="text-lg font-semibold">Total Revenue Breakdown</h4>
        <ul className="list-disc list-inside">
          {Object.entries(data).map(([category, amount], index) => (
            <li key={index}>
              {category.charAt(0).toUpperCase() + category.slice(1)}: {amount}
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default RevenueBreakdown;
  