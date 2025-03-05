import React from "react";
import Image from "next/image";

interface Product {
    id: string;
    name: string;
    price: number;
    imageUrl?: string;
}

interface ProductListProps {
    products: Product[];
}

const ProductList: React.FC<ProductListProps> = ({ products }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.length > 0 ? (
                products.map((product) => {
                    // Ensure the image URL is valid
                    const imageSrc = product.imageUrl && product.imageUrl.trim() !== ""
                        ? `/images/${product.imageUrl}`
                        : "/images/placeholder.png";

                    return (
                        <div key={product.id} className="bg-gray-900 p-4 rounded-lg shadow-lg">
                            <Image
                                src={imageSrc}
                                alt={product.name}
                                width={200}
                                height={128}
                                className="w-full h-32 object-cover rounded-md"
                            />
                            <h3 className="text-white text-lg font-semibold mt-2">{product.name}</h3>
                            <p className="text-blue-400 font-bold">
                                Ksh. {product.price ? product.price.toLocaleString() : "0"}
                            </p>
                            <button className="mt-3 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                                Add to Cart
                            </button>
                        </div>
                    );
                })
            ) : (
                <p className="text-gray-400">No products available.</p>
            )}
        </div>
    );
};

export default ProductList;
