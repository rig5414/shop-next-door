interface Customer {
    name: string;
    purchases: string;
    shop: string;
  }
  
  interface RepeatCustomersProps {
    data: Customer[];
  }
  
  const RepeatCustomers: React.FC<RepeatCustomersProps> = ({ data }) => {
    return (
      <div className="bg-gray-800 p-4 rounded-lg">
        <h4 className="text-lg font-semibold">Repeat Customers</h4>
        <ul className="list-disc list-inside">
          {data.map((customer: Customer, index: number) => (
            <li key={index}>
              {customer.name} - {customer.purchases} from {customer.shop}
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default RepeatCustomers;
  