interface SalesDayData {
  day: string;
  products: string;
  quantity: number;
  shop: string;
  time: string;
}

interface SalesDayCardProps {
  title: string;
  data?: SalesDayData;
}

const SalesDayCard: React.FC<SalesDayCardProps> = ({ title, data }) => {
  if (!data) {
    return (
      <div className="bg-gray-800 p-4 rounded-lg text-center text-gray-400">
        No sales data available.
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md">
      <h4 className="text-lg font-semibold text-white mb-3">
        {title && title !== "Sales on undefined" 
          ? title 
          : "Daily Sales"}: <span className="text-yellow-400">{data.day || "N/A"}</span>
      </h4>
      <div className="space-y-2">
        <p className="text-gray-300">
          <span className="font-semibold text-white">Products Sold:</span>{" "}
          {data.products && data.products !== "undefined" ? data.products : "0"}
        </p>
        <p className="text-gray-300">
          <span className="font-semibold text-white">Quantity:</span>{" "}
          {data.quantity || 0}
        </p>
        <p className="text-gray-300">
          <span className="font-semibold text-white">Shop:</span>{" "}
          {data.shop || "N/A"}
        </p>
        <p className="text-gray-300">
          <span className="font-semibold text-white">Transaction Time:</span>{" "}
          {data.time || "N/A"}
        </p>
      </div>
    </div>
  );
};

export default SalesDayCard;