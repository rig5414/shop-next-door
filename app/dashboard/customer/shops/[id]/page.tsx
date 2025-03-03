"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DashboardLayout from "../../../../../components/layout/DashboardLayout";
import { FiShoppingBag } from "react-icons/fi";
import Image from "next/image";

type Product = {
    id: string;
    price: number;
    catalog: {
        id: string;
        name: string;
        description: string;
        defaultPrice: number;
        image: string;
        category: string;
    };
};

type Shop = {
    id: string;
    name: string;
    description: string;
    status: "active" | "inactive";
};

const ShopPage = () => {
    const params = useParams();
    const id = params?.id as string | undefined;
    const [shop, setShop] = useState<Shop | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        const fetchShopDetails = async () => {
            setLoading(true);
            try {
                console.log(`Fetching shop with ID: ${id}`);

                const [shopResponse, productsResponse] = await Promise.all([
                    fetch(`/api/shops/${id}`, { cache: "no-store" }),
                    fetch(`/api/products?shopId=${id}`, { cache: "no-store" }),
                ]);

                if (!shopResponse.ok) throw new Error(`Failed to fetch shop details: ${shopResponse.status}`);
                if (!productsResponse.ok) throw new Error(`Failed to fetch products: ${productsResponse.status}`);

                const shopData: Shop = await shopResponse.json();
                const productsData: Product[] = await productsResponse.json();

                setShop(shopData);
                setProducts(productsData);
            } catch (err) {
                console.error("Error in shop details page:", err);
                setError(err instanceof Error ? err.message : "An unknown error occurred");
            } finally {
                setLoading(false);
            }
        };

        fetchShopDetails();
    }, [id]);

    if (loading) {
        return (
            <DashboardLayout role="customer">
                <div className="flex justify-center items-center h-64">
                    <p className="text-white">Loading shop details...</p>
                </div>
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout role="customer">
                <div className="bg-red-900/30 border border-red-500 p-6 rounded-lg text-center">
                    <p className="text-red-400 mb-2">Error loading shop details:</p>
                    <p className="text-white">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        Try Again
                    </button>
                </div>
            </DashboardLayout>
        );
    }

    if (!shop) {
        return (
            <DashboardLayout role="customer">
                <div className="bg-yellow-900/30 border border-yellow-500 p-6 rounded-lg text-center">
                    <p className="text-yellow-400">Shop not found.</p>
                    <a
                        href="/customer/shops"
                        className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Back to Shops
                    </a>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="customer">
            <div className="text-white">
                {/* Shop Details */}
                <div className="mb-6 p-6 bg-gray-900 rounded-lg">
                    <div className="flex items-center mb-3">
                        <FiShoppingBag className="text-blue-400 w-6 h-6 mr-3" />
                        <h1 className="text-2xl font-semibold">{shop.name}</h1>
                    </div>
                    <p className="text-gray-400 mb-3">{shop.description}</p>
                    <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
                            shop.status === "active" ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"
                        }`}
                    >
                        {shop.status === "active" ? "Open" : "Closed"}
                    </span>
                </div>

                {/* Product Catalog */}
                <h2 className="text-xl font-semibold mb-4">Products</h2>
                {products.length === 0 ? (
                    <p className="text-gray-400 p-6 bg-gray-800 rounded-lg text-center">No products available at this time.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product) => (
                            <div key={product.id} className="bg-gray-800 p-4 rounded-lg transform transition-transform hover:scale-105 hover:shadow-lg hover:bg-gray-900">
                                {/* Image with Fallback */}
                                <div className="relative w-full h-48 mb-3">
                                    <Image
                                        src={product.catalog.image || "/placeholder-product.jpg"}
                                        alt={product.catalog.name}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        className="object-cover rounded-lg"
                                    />
                                </div>
                                <h3 className="text-lg font-medium">{product.catalog.name}</h3>
                                <p className="text-blue-400 font-bold mb-3">KSh {product.price.toLocaleString()}</p>
                                <button className="w-full bg-blue-600 px-4 py-2 rounded-lg text-white hover:bg-blue-700 transition">
                                    Add to Cart
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default ShopPage;