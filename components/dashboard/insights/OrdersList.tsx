interface Order {
    customer: string;
    items: string;
    status: string;
  }
  
  interface OrdersListProps {
    title: string;
    data: Order[];
  }
  
  const OrdersList: React.FC<OrdersListProps> = ({ title, data }) => {
    return (
      <div className="bg-gray-800 p-4 rounded-lg">
        <h4 className="text-lg font-semibold">{title}</h4>
        <ul className="list-disc list-inside">
          {data.map((order: Order, index: number) => (
            <li key={index}>
              {order.customer} ordered {order.items} - Status: {order.status}
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default OrdersList;
  