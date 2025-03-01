import React from "react";

interface OrderItem {
  productName: string;
  quantity: number;
}

interface Order {
  customerName: string;
  items: OrderItem[];
  status: string;
}

interface OrdersListProps {
  title: string;
  data: Order[] | undefined; // Allow undefined data
}

const OrdersList: React.FC<OrdersListProps> = ({ title, data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-gray-800 p-4 rounded-lg shadow-md">
        <h4 className="text-lg font-semibold text-white mb-3">{title}</h4>
        <p className="text-gray-400 text-sm">No recent orders.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md">
      <h4 className="text-lg font-semibold text-white mb-3">{title}</h4>
      <ul className="text-gray-300 space-y-2">
        {data.map((order, index) => (
          <li key={index} className="border-b border-gray-700 pb-2">
            <span className="font-semibold">{order.customerName}</span> ordered{" "}
            {order.items.map((item) => `${item.quantity}x ${item.productName}`).join(", ")}
            <span
              className={`ml-2 px-2 py-1 text-xs rounded ${getStatusClass(
                order.status
              )}`}
            >
              {order.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Function to dynamically apply styling based on order status
const getStatusClass = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-500 text-gray-900";
    case "shipped":
      return "bg-blue-500 text-white";
    case "completed":
      return "bg-green-500 text-white";
    case "cancelled":
      return "bg-red-500 text-white";
    default:
      return "bg-gray-600 text-white";
  }
};

export default OrdersList;