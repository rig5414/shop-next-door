"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import Image from "next/image";
import { use } from "react";


interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface Shop {
  id: number;
  name: string;
  description: string;
  products: Product[];
}

const ShopPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const [shop, setShop] = useState<Shop | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Fetch shop data based on ID (replace with actual API)
    const fetchShop = async () => {
      // Simulated shop data
      const shopData: Shop = {
        id: parseInt(id),
        name: "SuperMart",
        description: "Your one-stop shop for daily needs!",
        products: [
          { id: 1, name: "Apples", price: 1.99, image: "/apple.jpg" },
          { id: 2, name: "Milk", price: 2.49, image: "/milk.jpg" },
          { id: 3, name: "Bread", price: 1.29, image: "/bread.jpg" },
        ],
      };
      setShop(shopData);
    };

    if (id) fetchShop();
  }, [id]);

  if (!shop) return <p className="text-center text-white">Loading shop details...</p>;

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white">{shop.name}</h1>
        <p className="text-gray-300">{shop.description}</p>

        <h2 className="text-xl font-semibold mt-4 text-white">Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
          {shop.products.map((product) => (
            <div key={product.id} className="bg-gray-800 p-4 rounded-lg">
              <Image 
                src={product.image} 
                alt={product.name} 
                width={300} 
                height={300} 
                className="w-full h-32 object-cover rounded"/>
              <h3 className="text-lg font-semibold text-white mt-2">{product.name}</h3>
              <p className="text-gray-400">${product.price.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ShopPage;
