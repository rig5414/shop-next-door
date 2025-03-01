import React from "react";

interface Customer {
  name: string;
  purchases: number;
  shopName: string;
}

interface RepeatCustomersProps {
  data: Customer[] | null | undefined;
}

const RepeatCustomers: React.FC<RepeatCustomersProps> = ({ data }) => {
  if (!Array.isArray(data) || data.length === 0) {
    console.warn("No customer data found in insights"); // Corrected console message
    return <div className="text-gray-400 text-sm">No repeat customers found.</div>;
  }

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md">
      <h4 className="text-lg font-semibold text-white mb-3">Repeat Customers</h4>
      <ul className="text-gray-300 space-y-2">
        {data.map((customer, index) => (
          <li key={index} className="border-b border-gray-700 pb-2">
            <span className="font-semibold">{customer.name}</span> - {customer.purchases} purchases from{" "}
            <span className="italic">{customer.shopName}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RepeatCustomers;