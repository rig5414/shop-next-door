"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Image from "next/image"
import { useSession } from "next-auth/react"
import ProductModal from "./ProductModals"

interface Product {
  id: string
  name?: string
  price: number
  stock: number
  image?: string
  catalog?: {
    id: string
    name: string
    description?: string
    defaultPrice?: string
    image?: string
  }
  catalogId?: string
}

interface ProductListProps {
  products?: Product[]
  shopId?: string
  shopType?: "local_shop" | "grocery_shop"
  hidePriceAndStock?: boolean
  onProductUpdate?: (product: Product) => void
  onProductDelete?: (productId: string) => void
}

const ProductList: React.FC<ProductListProps> = ({ 
  products = [], 
  shopId, 
  shopType, 
  hidePriceAndStock = false,
  onProductUpdate,
  onProductDelete 
}) => {
  const [fetchedProducts, setFetchedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const { data: session } = useSession()
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [modalType, setModalType] = useState<"edit" | "delete" | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    if (!shopId) return;
    
    if (products.length === 0) {
      const fetchProducts = async () => {
        setLoading(true);
        try {
          const res = await fetch(`/api/products?shopId=${shopId}`);
          const data = await res.json();
          if (!res.ok) throw new Error("Failed to fetch products");
          setFetchedProducts(data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

      fetchProducts();
    }
  }, [shopId, products]);

  const displayedProducts = products.length > 0 ? products : fetchedProducts

  const openModal = (type: "edit" | "delete", product: Product) => {
    console.log("Opening modal:", type)
    console.log("Product:", product)
    console.log("Shop Type:", shopType)
    console.log("Shop ID:", shopId)
    console.log("Product Image:", product.image)
    setSelectedProduct(product)
    setModalType(type)
    setIsModalOpen(true)
  }

  const handleProductUpdate = (updatedProduct: Product) => {
    setFetchedProducts((prevProducts) => prevProducts.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)))
  }

  const handleProductDelete = (productId: string) => {
    setFetchedProducts((prevProducts) => prevProducts.filter((p) => p.id !== productId))
  }

  const handleSubmit = async (data: any) => {
    if (modalType === "edit") {
      console.log('Starting edit operation with data:', data);
      console.log('Selected product before edit:', selectedProduct);
      
      try {
        setActionLoading(data.id);
        const requestBody = {
          shopId,
          name: data.name,
          price: parseFloat(data.price),
          stock: parseInt(data.stock, 10),
        };
        console.log('Sending edit request with:', requestBody);

        const res = await fetch(`/api/products/${data.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });

        const responseData = await res.json();
        console.log('Edit response:', {
          status: res.status,
          statusText: res.statusText,
          data: responseData
        });

        if (!res.ok) {
          throw new Error(responseData.message || "Failed to update product");
        }

        const updatedProduct = {
          ...selectedProduct,
          ...data,
          price: parseFloat(data.price),
          stock: parseInt(data.stock, 10),
        };
        console.log('Final updated product:', updatedProduct);

        handleProductUpdate(updatedProduct);
        onProductUpdate?.(updatedProduct);
        setIsModalOpen(false);
      } catch (error) {
        console.error("Edit error full details:", {
          error,
          message: error instanceof Error ? error.message : "Unknown error",
          data
        });
      }
    } else if (modalType === "delete") {
      console.log('Starting delete operation');
      console.log('Selected product for deletion:', selectedProduct);
      
      try {
        if (!selectedProduct?.id) {
          console.error('No product selected for deletion');
          throw new Error("No product selected for deletion");
        }

        setActionLoading(selectedProduct.id);
        console.log('Sending delete request for product:', selectedProduct.id);

        const res = await fetch(`/api/products/${selectedProduct.id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ shopId })
        });

        console.log('Delete response:', {
          status: res.status,
          statusText: res.statusText
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to delete product");
        }

        handleProductDelete(selectedProduct.id);
        onProductDelete?.(selectedProduct.id);
        
        setIsModalOpen(false);
        setModalType(null);
        setSelectedProduct(null);
      } catch (error) {
        console.error("Delete error full details:", {
          error,
          selectedProduct,
          shopId
        });
      } finally {
        setActionLoading(null);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {loading ? (
        <p className="text-gray-400">Loading products...</p>
      ) : displayedProducts.length > 0 ? (
        displayedProducts.map((product) => {
          const imageSrc = product.image?.trim() ? product.image : "/images/placeholder.jpg"
          const productName = product.catalog?.name || product.name || "Product"

          return (
            <div
              key={product.id}
              className="bg-gray-900 p-4 rounded-lg hover:scale-105 hover:shadow-lg hover:bg-gray-800 transition"
            >
              <Image
                src={imageSrc || "/placeholder.svg"}
                alt={productName}
                width={200}
                height={128}
                className="w-full h-32 object-cover rounded-md"
                onError={(e) => {
                  e.currentTarget.src = "/images/placeholder.jpg"
                }}
              />

              <h3 className="text-white text-lg font-semibold mt-2">{productName}</h3>
              {!hidePriceAndStock && (
                <>
                  <p className="text-blue-400 font-bold">
                    Ksh. {product.price !== undefined ? product.price.toLocaleString() : "N/A"}
                  </p>
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
                <button className="mt-3 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Add to Cart</button>
              )}
            </div>
          )
        })
      ) : (
        <p className="text-gray-400">No products available.</p>
      )}

      {modalType && selectedProduct && isModalOpen && (
        <ProductModal
          type={modalType}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          product={{
            id: selectedProduct.id,
            name: selectedProduct.catalog?.name || selectedProduct.name || "Product",
            price: selectedProduct.price,
            stock: selectedProduct.stock,
            image: selectedProduct.image || "/images/placeholder.jpg",
          }}
          onSubmit={handleSubmit}
          shopType={shopType || "local_shop"}
          shopId={shopId || ""}
        />
      )}
    </div>
  )
}

export default ProductList

