import Image from "next/image";

interface ShopInfoProps {
  name: string;
  description: string;
  category: string;
  logo: string;
  onEdit: () => void;
}

const ShopInfoCard: React.FC<ShopInfoProps> = ({ name, description, category, logo, onEdit }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <div className="flex items-center gap-4">
        <Image src={logo} alt="Shop Logo" width={64} height={64} className="rounded-full" />
        <div>
          <h1 className="text-2xl font-bold text-white">{name}</h1>
          <p className="text-gray-400">{category}</p>
        </div>
      </div>
      <p className="mt-2 text-gray-300">{description}</p>
      <button 
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        onClick={onEdit}
      >
        Edit Shop Details
      </button>
    </div>
  );
};

export default ShopInfoCard;
