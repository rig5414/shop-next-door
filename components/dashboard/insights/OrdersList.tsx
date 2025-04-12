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
  data: Order[] | undefined;
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1">
              <span className="font-semibold">{order.customerName || "Unknown Customer"}</span>
              <span
                className={`mt-1 sm:mt-0 px-2 py-1 text-xs rounded ${getStatusClass(
                  order.status
                )}`}
              >
                {order.status}
              </span>
            </div>
            <div>
              ordered{" "}
              {order.items && order.items.length > 0
                ? order.items.map((item, i) => (
                    <span key={i}>
                      {i > 0 && ", "}
                      {item.quantity}x {item.productName || "Product"}
                    </span>
                  ))
                : "items"}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Function to dynamically apply styling based on order status
const getStatusClass = (status: string) => {
  switch (status?.toLowerCase()) {
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