interface SalesDayData {
  day: string;
  products: string;
  quantity: number;
  shop: string;
  time: string;
}

interface SalesDayCardProps {
  title: string;
  data?: SalesDayData; // Optional to handle undefined/null
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
        {title}: <span className="text-yellow-400">{data.day}</span>
      </h4>
      <p className="text-gray-300">
        <span className="font-semibold text-white">Products Sold:</span> {data.products}
      </p>
      <p className="text-gray-300">
        <span className="font-semibold text-white">Quantity:</span> {data.quantity}
      </p>
      <p className="text-gray-300">
        <span className="font-semibold text-white">Shop:</span> {data.shop}
      </p>
      <p className="text-gray-300">
        <span className="font-semibold text-white">Transaction Time:</span> {data.time}
      </p>
    </div>
  );
};

export default SalesDayCard;
