interface SalesDayData {
    day: string;
    products: string;
    quantity: number;
    shop: string;
    time: string;
  }
  
  interface SalesDayCardProps {
    title: string;
    data: SalesDayData;
  }
  
  const SalesDayCard: React.FC<SalesDayCardProps> = ({ title, data }) => {
    return (
      <div className="bg-gray-800 p-4 rounded-lg">
        <h4 className="text-lg font-semibold">{title}: {data.day}</h4>
        <p>Products Sold: {data.products}</p>
        <p>Quantity: {data.quantity}</p>
        <p>Shop: {data.shop}</p>
        <p>Transaction Time: {data.time}</p>
      </div>
    );
  };
  
  export default SalesDayCard;
  