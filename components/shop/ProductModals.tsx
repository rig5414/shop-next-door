import { useState, useEffect } from "react";

interface Product {
  id: string;
  name: string;
  description?: string;
  price?: number;
  stock?: number;
}

interface ProductModalProps {
  type: "edit" | "delete" | "add";
  isOpen: boolean;
  onClose: () => void;
  shopType: "local_shop" | "grocery_shop";
  product?: Product;
  shopId: string;
  onSubmit: (data?: any) => void;
}

export default function ProductModal({ isOpen, onClose, shopType, shopId, product, type, onSubmit }: ProductModalProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [productDetails, setProductDetails] = useState<Product | null>(product || null);

  useEffect(() => {
    if (!isOpen) return;

    if (type === "edit" && product) {
      setProductDetails(product);
    }

    if (type === "add") {
      const fetchProducts = async () => {
        try {
          const res = await fetch(`/api/product-catalog?category=${shopType}`);
          const data = await res.json();
          if (!res.ok) throw new Error("Failed to fetch products");
          setProducts(data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
      fetchProducts();
    }
  }, [isOpen, shopType, type, product]);

  const handleProductSelect = (product: Product) => {
    setSelectedProducts((prev) =>
      prev.some((p) => p.id === product.id)
        ? prev.filter((p) => p.id !== product.id)
        : [...prev, { ...product, price: 0, stock: 0 }]
    );
  };

  const handleInputChange = (field: "price" | "stock", value: number) => {
    if (productDetails) {
      setProductDetails({ ...productDetails, [field]: value });
    }
  };

  const handleSave = async () => {
    try {
      if (type === "edit" && productDetails) {
        const res = await fetch(`/api/products/${productDetails.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ price: productDetails.price, stock: productDetails.stock }),
        });

        if (!res.ok) throw new Error("Failed to update product");
      } else if (type === "add" && selectedProducts.length > 0) {
        const res = await fetch(`/api/products`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            shopId,
            products: selectedProducts.map(({ id, price, stock }) => ({ productId: id, price, stock })),
          }),
        });

        if (!res.ok) throw new Error("Failed to add products");
      }

      onSubmit();
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (!product) return;
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete product");

      onSubmit();
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-gray-900 p-6 rounded-lg w-full max-w-md">
        {type === "add" && (
          <>
            <h2 className="text-lg font-semibold text-white">Add Products</h2>

            {loading ? (
              <p className="text-white mt-2">Loading products...</p>
            ) : (
              <ul className="max-h-40 overflow-y-auto mt-4 bg-gray-800 p-2 rounded">
                {products.map((product) => {
                  const isSelected = selectedProducts.some((p) => p.id === product.id);
                  return (
                    <li key={product.id} className="p-2">
                      <button
                        className={`w-full text-left text-white p-2 rounded ${
                          isSelected ? "bg-blue-500" : "hover:bg-gray-700"
                        }`}
                        onClick={() => handleProductSelect(product)}
                        type="button"
                        data-selected={isSelected}
                      >
                        {product.name} - {product.description}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </>
        )}

        {type === "edit" && productDetails && (
          <>
            <h2 className="text-lg font-semibold text-white">Edit Product</h2>
            <div className="mt-4">
              <p className="text-white">{productDetails.name}</p>

              <label htmlFor="price" className="block mt-2 text-white">
                Price:
              </label>
              <input
                id="price"
                type="number"
                value={productDetails.price || 0}
                onChange={(e) => handleInputChange("price", Number(e.target.value))}
                className="w-full p-2 rounded bg-gray-700 text-white"
                title="Enter price for the product"
                placeholder="Enter price"
              />

              <label htmlFor="stock" className="block mt-2 text-white">
                Stock:
              </label>
              <input
                id="stock"
                type="number"
                value={productDetails.stock || 0}
                onChange={(e) => handleInputChange("stock", Number(e.target.value))}
                className="w-full p-2 rounded bg-gray-700 text-white"
                title="Enter stock quantity"
                placeholder="Enter stock"
              />
            </div>
          </>
        )}

        {type === "delete" && product && (
          <>
            <h2 className="text-lg font-semibold text-white">Delete Product</h2>
            <p className="text-white mt-2">Are you sure you want to delete {product.name}?</p>
          </>
        )}

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="bg-gray-600 text-white px-4 py-2 rounded mr-2"
            aria-label="Cancel and close the modal"
          >
            Cancel
          </button>

          {type === "add" && selectedProducts.length > 0 && (
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white px-4 py-2 rounded"
              aria-label="Save all selected products"
            >
              Save All
            </button>
          )}

          {type === "edit" && productDetails && (
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white px-4 py-2 rounded"
              aria-label="Save edited product"
            >
              Save
            </button>
          )}

          {type === "delete" && product && (
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded"
              aria-label="Delete product"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
