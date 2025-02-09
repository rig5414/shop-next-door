import React from "react";

interface Order {
  id: number;
  product: string;
  status: string;
  amount: string;
}

const orders: Order[] = [
  { id: 1, product: "Wireless Earbuds", status: "Delivered", amount: "$29.99" },
  { id: 2, product: "Smart Watch", status: "Shipped", amount: "$99.99" },
  { id: 3, product: "Bluetooth Speaker", status: "Pending", amount: "$49.99" },
];

const OrderList: React.FC = () => {
  return (
    <div className="bg-gray-900 p-4 rounded-lg shadow-lg">
      <table className="w-full text-white">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="text-left p-2">Product</th>
            <th className="text-left p-2">Status</th>
            <th className="text-right p-2">Amount</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b border-gray-700">
              <td className="p-2">{order.product}</td>
              <td className={`p-2 ${order.status === "Pending" ? "text-yellow-400" : "text-green-400"}`}>
                {order.status}
              </td>
              <td className="p-2 text-right">{order.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderList;
