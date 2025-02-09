import React from "react";
import Image from "next/image";

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
}

const products: Product[] = [
  { id: 1, name: "Gaming Headset", price: "$89.99", image: "/images/headset.jpg" },
  { id: 2, name: "Mechanical Keyboard", price: "$129.99", image: "/images/keyboard.jpg" },
  { id: 3, name: "4K Monitor", price: "$299.99", image: "/images/monitor.jpg" },
];

const ProductList: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {products.map((product) => (
        <div key={product.id} className="bg-gray-900 p-4 rounded-lg shadow-lg">
          <Image
            src={product.image}
            alt={product.name}
            width={200} // Set appropriate width
            height={128} // Set appropriate height
            className="w-full h-32 object-cover rounded-md" />
          <h3 className="text-white text-lg font-semibold mt-2">{product.name}</h3>
          <p className="text-blue-400 font-bold">{product.price}</p>
          <button className="mt-3 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Add to Cart</button>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
