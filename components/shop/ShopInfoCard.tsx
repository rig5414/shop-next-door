import Image from "next/image";
import { useEffect, useState } from "react";
import { fetchShop } from "../../lib/api";

interface ShopInfoProps {
  shopId: string;
  onEdit: (shop: ShopData) => void;
  shopData?: ShopData;
}

interface ShopData {
  id: string;
  name: string;
  description: string;
  type: "local_shop" | "grocery_shop";
  logo?: string;
  vendorId: string;
}

const categoryMap: Record<ShopData["type"], string> = {
  local_shop: "Local Shop",
  grocery_shop: "Grocery Shop",
};

const ShopInfoCard: React.FC<ShopInfoProps> = ({ shopId, onEdit, shopData }) => {
  const [shop, setShop] = useState<ShopData | null>(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    if (shopData) {
      setShop(shopData);
      setLoading(false);
      return;
    }
    const loadShop = async () => {
      setLoading(true); // Set loading to true before fetching
      try {
        const shopData = await fetchShop(shopId);
        if (shopData) setShop(shopData);
      } catch (error) {
        console.error("Error loading shop:", error);
        // Handle error, e.g., display an error message
      } finally {
        setLoading(false); // Set loading to false after fetching (or error)
      }
    };

    loadShop();
  }, [shopId, shopData]);

  if (loading) {
    return <p className="text-gray-400">Loading shop details...</p>;
  }

  if (!shop) {
    return <p className="text-gray-400">Shop not found.</p>; // Handle shop not found
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <div className="flex items-center gap-4">
        {shop.logo && (
          <Image
          src={shop.logo || "/images/default-shop.png"}
          alt={shop.name ? `${shop.name} Logo` : "Shop Logo"}
          width={64}
          height={64}
          className="rounded-full"
        />        
        )}
        <div>
          <h1 className="text-2xl font-bold text-white">{shop.name}</h1>
          <p className="text-gray-400">{categoryMap[shop.type]}</p>
        </div>
      </div>
      <p className="mt-2 text-gray-300">{shop.description}</p>
      <button
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        onClick={() => onEdit(shop)}
      >
        Edit Shop Details
      </button>
    </div>
  );
};

export default ShopInfoCard;