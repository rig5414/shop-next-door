import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import ProductModal from "./ProductModals";

interface Product {
    id: string;
    name: string;
    price: number;
    stock: number;
    imageUrl?: string;
}

interface ProductListProps {
    products?: Product[];
    shopId?: string;
    shopType?: "local_shop" | "grocery_shop";
    hidePriceAndStock?: boolean; // New prop to control visibility
}

const ProductList: React.FC<ProductListProps> = ({ products = [], shopId, shopType, hidePriceAndStock = false }) => {
    const [fetchedProducts, setFetchedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const { data: session } = useSession();
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [modalType, setModalType] = useState<"edit" | "delete" | null>(null);

    useEffect(() => {
        if (!shopId) return;

        const fetchProducts = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/products?shopId=${shopId}`);
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Failed to fetch products");
                setFetchedProducts(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [shopId]);

    const displayedProducts = shopId ? fetchedProducts : products;

    const openModal = (type: "edit" | "delete", product: Product) => {
        setSelectedProduct(product);
        setModalType(type);
    };

    const handleProductUpdate = (updatedProduct: Product) => {
        setFetchedProducts((prevProducts) =>
            prevProducts.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
        );
    };

    const handleProductDelete = (productId: string) => {
        setFetchedProducts((prevProducts) =>
            prevProducts.filter((p) => p.id !== productId)
        );
    };

    const handleSubmit = async (data: any) => {
        if (modalType === "edit") {
            // Call API to update product
            try {
                const res = await fetch(`/api/products/${data.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ price: data.price, stock: data.stock }),
                });
                if (!res.ok) throw new Error("Failed to update product");
                handleProductUpdate(data);
            } catch (error) {
                console.error(error);
            }
        } else if (modalType === "delete") {
            // Call API to delete product
            try {
                const res = await fetch(`/api/products/${data.id}`, { method: "DELETE" });
                if (!res.ok) throw new Error("Failed to delete product");
                handleProductDelete(data.id);
            } catch (error) {
                console.error(error);
            }
        }
        setModalType(null);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loading ? (
                <p className="text-gray-400">Loading products...</p>
            ) : displayedProducts.length > 0 ? (
                displayedProducts.map((product) => {
                    const imageSrc = product.imageUrl?.trim() ? product.imageUrl : "/images/placeholder.jpg";
                    return (
                        <div key={product.id} className="bg-gray-900 p-4 rounded-lg shadow-lg">
                            <Image
                                src={imageSrc}
                                alt={product.name || "Product Image"}
                                width={200}
                                height={128}
                                className="w-full h-32 object-cover rounded-md"
                            />

                            <h3 className="text-white text-lg font-semibold mt-2">{product.name}</h3>
                            {!hidePriceAndStock && (
                                <>
                                    <p className="text-blue-400 font-bold">Ksh. {product.price !== undefined ? product.price.toLocaleString() : "N/A"}</p>
                                    <p className="text-gray-300">Stock: {product.stock}</p>
                                </>
                            )}

                            {session?.user?.role === "vendor" ? (
                                <>
                                    <button
                                        onClick={() => openModal("edit", product)}
                                        className="mt-3 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-2"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => openModal("delete", product)}
                                        className="mt-3 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                                    >
                                        Delete
                                    </button>
                                </>
                            ) : (
                                <button className="mt-3 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                                    Add to Cart
                                </button>
                            )}
                        </div>
                    );
                })
            ) : (
                <p className="text-gray-400">No products available.</p>
            )}

            {modalType && selectedProduct && shopType && shopId && (
                <ProductModal
                    type={modalType}
                    isOpen={!!modalType}
                    onClose={() => setModalType(null)}
                    product={selectedProduct}
                    onSubmit={handleSubmit}
                    shopType={shopType}
                    shopId={shopId} 
                />
            )}
        </div>
    );
};

export default ProductList;
