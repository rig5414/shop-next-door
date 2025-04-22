"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface Product {
  id: string
  name: string
  description?: string
  price?: number
  stock?: number
  image?: string
}

interface ProductModalProps {
  type: "edit" | "delete" | "add"
  isOpen: boolean
  onClose: () => void
  shopType: "local_shop" | "grocery_shop"
  product?: Product
  shopId: string
  onSubmit: (data?: any) => void
}

export default function ProductModal({
  isOpen,
  onClose,
  shopType,
  shopId,
  product,
  type,
  onSubmit,
}: ProductModalProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProducts, setSelectedProducts] = useState<Map<string, Product>>(new Map())
  const [loading, setLoading] = useState<boolean>(true)
  const [productDetails, setProductDetails] = useState<Product | null>(product || null)
  const [activeProductId, setActiveProductId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>("")

  useEffect(() => {
    if (!isOpen) return

    if (type === "edit" && product) {
      setProductDetails(product)
    }

    if (type === "add") {
      const fetchProducts = async () => {
        try {
          const res = await fetch(`/api/product-catalog?category=${shopType}`)
          const data = await res.json()
          if (!res.ok) throw new Error("Failed to fetch products")
          setProducts(data)
        } catch (error) {
          console.error(error)
        } finally {
          setLoading(false)
        }
      }
      fetchProducts()
    }
  }, [isOpen, shopType, type, product])

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const handleProductSelect = (product: Product) => {
    const newMap = new Map(selectedProducts)

    if (newMap.has(product.id)) {
      newMap.delete(product.id)
      if (activeProductId === product.id) {
        setActiveProductId(null)
      }
    } else {
      newMap.set(product.id, {
        ...product,
        price: 0,
        stock: 0,
      })
      setActiveProductId(product.id)
    }

    setSelectedProducts(newMap)
  }

  const handleProductDetailChange = (productId: string, field: "price" | "stock", value: number) => {
    if (type === "edit" && productDetails) {
      setProductDetails({ ...productDetails, [field]: value })
    } else if (type === "add") {
      const newMap = new Map(selectedProducts)
      const product = newMap.get(productId)

      if (product) {
        newMap.set(productId, { ...product, [field]: value })
        setSelectedProducts(newMap)
      }
    }
  }

  const handleSave = async () => {
    try {
      if (type === "edit" && productDetails) {
        onSubmit(productDetails);
      } else if (type === "add" && selectedProducts.size > 0) {
        const productsArray = Array.from(selectedProducts.values());

        const res = await fetch(`/api/products`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            shopId,
            products: productsArray.map(({ id, price, stock, image }) => ({
              productId: id,
              price,
              stock,
              image,
            })),
          }),
        });

        if (!res.ok) throw new Error("Failed to add products");
        
        // Pass back the added products
        onSubmit(productsArray);
      }
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (!product) return
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error("Failed to delete product")

      onSubmit()
      onClose()
    } catch (error) {
      console.error(error)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-50">
      <div className="bg-gray-900 rounded-lg w-full max-w-md flex flex-col max-h-[500px]">
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          {type === "add" && (
            <h2 className="text-lg font-semibold text-white">
              Add Products to {shopType === "local_shop" ? "Local Shop" : "Grocery Shop"}
            </h2>
          )}
          {type === "edit" && productDetails && <h2 className="text-lg font-semibold text-white">Edit Product</h2>}
          {type === "delete" && product && <h2 className="text-lg font-semibold text-white">Delete Product</h2>}
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4">
          {type === "add" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-white font-medium mb-2">Available Products</h3>

                  {/* Add search input */}
                  <div className="mb-3">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full p-2 pl-8 rounded bg-gray-700 text-white text-sm"
                      />
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 absolute left-2 top-2.5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                  </div>

                  {loading ? (
                    <p className="text-white">Loading products...</p>
                  ) : (
                    <ul className="max-h-40 overflow-y-auto">
                      {filteredProducts.map((product) => {
                        const isSelected = selectedProducts.has(product.id)
                        return (
                          <li key={product.id} className="mb-2">
                            <button
                              className={`w-full text-left text-white p-2 rounded text-sm ${
                                isSelected ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"
                              }`}
                              onClick={() => handleProductSelect(product)}
                              type="button"
                            >
                              <div>
                                <div className="font-medium">{product.name}</div>
                                {product.description && (
                                  <div className="text-xs text-gray-400">{product.description}</div>
                                )}
                              </div>
                            </button>
                          </li>
                        )
                      })}
                      {filteredProducts.length === 0 && !loading && (
                        <li className="text-gray-400 text-sm py-2">No products found matching &#34;{searchQuery}&#34;</li>
                      )}
                    </ul>
                  )}
                </div>

                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-white font-medium mb-2">Selected ({selectedProducts.size})</h3>
                  {selectedProducts.size > 0 ? (
                    <ul className="max-h-40 overflow-y-auto">
                      {Array.from(selectedProducts.values()).map((product) => (
                        <li key={product.id} className="mb-2">
                          <button
                            className={`w-full text-left text-white p-2 rounded text-sm ${
                              activeProductId === product.id ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"
                            }`}
                            onClick={() => setActiveProductId(product.id)}
                            type="button"
                          >
                            <div>
                              <div className="font-medium">{product.name}</div>
                              <div className="text-xs text-gray-400">
                                Price: {product.price} | Stock: {product.stock}
                              </div>
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-400 text-sm">No products selected</p>
                  )}
                </div>
              </div>

              {activeProductId && (
                <div className="bg-gray-800 p-4 rounded-lg mb-4">
                  <h3 className="text-white font-medium mb-2">
                    Set Details: {selectedProducts.get(activeProductId)?.name}
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="price" className="block text-sm text-gray-300 mb-1">
                        Price (Ksh):
                      </label>
                      <input
                        id="price"
                        type="number"
                        value={selectedProducts.get(activeProductId)?.price || 0}
                        onChange={(e) => handleProductDetailChange(activeProductId, "price", Number(e.target.value))}
                        className="w-full p-2 rounded bg-gray-700 text-white"
                        min="0"
                      />
                    </div>
                    <div>
                      <label htmlFor="stock" className="block text-sm text-gray-300 mb-1">
                        Stock:
                      </label>
                      <input
                        id="stock"
                        type="number"
                        value={selectedProducts.get(activeProductId)?.stock || 0}
                        onChange={(e) => handleProductDetailChange(activeProductId, "stock", Number(e.target.value))}
                        className="w-full p-2 rounded bg-gray-700 text-white"
                        min="0"
                      />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {type === "edit" && productDetails && (
            <div className="bg-gray-800 p-4 rounded-lg mb-4">
              <div className="flex items-center mb-4">
                {productDetails.image && (
                  <div className="mr-4">
                    <Image
                      src={productDetails.image || "/images/placeholder.jpg"}
                      alt={productDetails.name || "Product Image"}
                      width={80}
                      height={80}
                      className="rounded-md object-cover"
                    />
                  </div>
                )}
                <h3 className="text-white font-medium">{productDetails.name}</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="price" className="block text-sm text-gray-300 mb-1">
                    Price (Ksh):
                  </label>
                  <input
                    id="price"
                    type="number"
                    value={productDetails.price || 0}
                    onChange={(e) => handleProductDetailChange(productDetails.id, "price", Number(e.target.value))}
                    className="w-full p-2 rounded bg-gray-700 text-white"
                    min="0"
                  />
                </div>
                <div>
                  <label htmlFor="stock" className="block text-sm text-gray-300 mb-1">
                    Stock:
                  </label>
                  <input
                    id="stock"
                    type="number"
                    value={productDetails.stock || 0}
                    onChange={(e) => handleProductDetailChange(productDetails.id, "stock", Number(e.target.value))}
                    className="w-full p-2 rounded bg-gray-700 text-white"
                    min="0"
                  />
                </div>
              </div>
            </div>
          )}

          {type === "delete" && product && (
            <div className="bg-gray-800 p-4 rounded-lg mb-4">
              <div className="flex items-center mb-4">
                {product.image && (
                  <div className="mr-4">
                    <Image
                      src={product.image || "/images/placeholder.jpg"}
                      alt={product.name || "Product Image"}
                      width={80}
                      height={80}
                      className="rounded-md object-cover"
                    />
                  </div>
                )}
                <div>
                  <h3 className="text-white font-medium">{product.name}</h3>
                  <p className="text-gray-400 text-sm">Price: Ksh. {product.price?.toLocaleString()}</p>
                  <p className="text-gray-400 text-sm">Stock: {product.stock}</p>
                </div>
              </div>
              <p className="text-red-400 text-sm">
                <strong>CAUTION:</strong> This action cannot be undone. This product will be permanently removed from your shop.
              </p>
            </div>
          )}
        </div>

        {/* Footer with buttons - Fixed at bottom */}
        <div className="p-4 border-t border-gray-700 bg-gray-900 rounded-b-lg mt-auto">
          <div className="flex justify-end">
            <button onClick={onClose} className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded mr-2">
              Cancel
            </button>

            {type === "add" && (
              <button
                onClick={handleSave}
                className={`${
                  selectedProducts.size > 0 ? "bg-blue-500 hover:bg-blue-600" : "bg-blue-500/50 cursor-not-allowed"
                } text-white px-4 py-2 rounded`}
                disabled={selectedProducts.size === 0}
              >
                Add Products
              </button>
            )}

            {type === "edit" && productDetails && (
              <button onClick={handleSave} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                Save Changes
              </button>
            )}

            {type === "delete" && product && (
              <button onClick={handleDelete} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
                Delete Product
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

