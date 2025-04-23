"use client";

interface SalesDayData {
  day: string;
  products: string;
  quantity: number;
  time: string;
  shop: string;
}

interface SalesDayCardProps {
  title: string;
  data: SalesDayData;
}

const SalesDayCard: React.FC<SalesDayCardProps> = ({ title, data }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md">
      <h4 className="text-lg font-semibold text-white mb-3">{title}</h4>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-400">Total Sales</span>
          <span className="font-medium text-white">
            Ksh. {Number(data.products).toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Completion Rate</span>
          <span className="font-medium text-green-400">
            {data.quantity}%
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Period</span>
          <span className="font-medium text-white">{data.day}</span>
        </div>
      </div>
    </div>
  );
};

export default SalesDayCard;