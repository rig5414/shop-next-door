"use client";

interface OrdersStatsProps {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
}

const OrdersStats: React.FC<OrdersStatsProps> = ({
  totalOrders,
  pendingOrders,
  completedOrders,
  cancelledOrders,
}) => {
  const stats = [
    { label: "Total Orders", value: totalOrders, color: "bg-blue-600" },
    { label: "Pending", value: pendingOrders, color: "bg-yellow-500" },
    { label: "Completed", value: completedOrders, color: "bg-green-600" },
    { label: "Canceled", value: cancelledOrders, color: "bg-red-600" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className={`p-4 ${stat.color} text-white rounded-lg`}>
          <h3 className="text-lg font-semibold">{stat.label}</h3>
          <p className="text-2xl font-bold">{stat.value}</p>
        </div>
      ))}
    </div>
  );
};

export default OrdersStats;
