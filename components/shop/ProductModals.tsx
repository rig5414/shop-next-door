import { useState, useEffect } from "react";

interface Product {
  id: string;
  name: string;
  description: string;
}

interface ProductModalProps {
  type: "edit" | "delete" | "add";
  isOpen: boolean;
  onClose: () => void;
  shopType: "local_shop" | "grocery_shop";
  product?: { id: string; name: string; price?: number; stock?: number };
  shopId: string;
  onSubmit: (data?: any) => void;
}

export default function ProductModal({ isOpen, onClose, shopType, shopId, onSubmit }: ProductModalProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<{ id: string; name: string; price: number; stock: number }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!isOpen) return;

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
  }, [isOpen, shopType]);

  const handleProductSelect = (product: Product) => {
    setSelectedProducts((prev) =>
      prev.some((p) => p.id === product.id)
        ? prev.filter((p) => p.id !== product.id)
        : [...prev, { id: product.id, name: product.name, price: 0, stock: 0 }]
    );
  };

  const handleInputChange = (id: string, field: "price" | "stock", value: number) => {
    setSelectedProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const handleSave = async () => {
    if (selectedProducts.length === 0) return;

    try {
      const res = await fetch(`/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shopId,
          products: selectedProducts.map(({ id, price, stock }) => ({ productId: id, price, stock })),
        }),
      });

      if (!res.ok) throw new Error("Failed to add products");

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
                    aria-pressed={isSelected}
                  >
                    {product.name} - {product.description}
                  </button>
                </li>
              );
            })}
          </ul>
          
        )}

        {selectedProducts.length > 0 && (
          <div className="mt-4">
            <h3 className="text-md font-semibold text-white">Set Price & Stock</h3>
            <div className="space-y-3">
              {selectedProducts.map((product) => (
                <div key={product.id} className="p-2 bg-gray-800 rounded">
                  <p className="text-white">{product.name}</p>
                  
                  <label htmlFor={`price-${product.id}`} className="block mt-2 text-white">
                    Price:
                  </label>
                  <input
                    id={`price-${product.id}`}
                    type="number"
                    value={product.price}
                    onChange={(e) => handleInputChange(product.id, "price", Number(e.target.value))}
                    className="w-full p-2 rounded bg-gray-700 text-white"
                    title="Enter price for the product"
                    placeholder="Enter price"
                    aria-label={`Set price for ${product.name}`}
                  />

                  <label htmlFor={`stock-${product.id}`} className="block mt-2 text-white">
                    Stock:
                  </label>
                  <input
                    id={`stock-${product.id}`}
                    type="number"
                    value={product.stock}
                    onChange={(e) => handleInputChange(product.id, "stock", Number(e.target.value))}
                    className="w-full p-2 rounded bg-gray-700 text-white"
                    title="Enter stock quantity"
                    placeholder="Enter stock"
                    aria-label={`Set stock for ${product.name}`}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="bg-gray-600 text-white px-4 py-2 rounded mr-2"
            aria-label="Cancel and close the modal"
          >
            Cancel
          </button>
          {selectedProducts.length > 0 && (
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white px-4 py-2 rounded"
              aria-label="Save all selected products"
            >
              Save All
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
