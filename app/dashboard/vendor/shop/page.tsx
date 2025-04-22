"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "../../../../components/layout/DashboardLayout";
import ProductList from "../../../../components/shop/ProductList";
import ShopInfoCard from "../../../../components/shop/ShopInfoCard";
import EditShopModal from "../../../../components/shop/EditShopModal";
import ProductModal from "../../../../components/shop/ProductModals";
import { useSession } from "next-auth/react";
import Spinner from "../../../../components/ui/Spinner";

interface Shop {
  id: string;
  name: string;
  description: string;
  category: string;
  type: "local_shop" | "grocery_shop";
  vendorId: string;
  logo?: string;
}

interface Product {
  id: string;
  name?: string;
  price: number;
  stock: number;
  image?: string;
  catalog?: {
    id: string;
    name: string;
    description?: string;
    defaultPrice?: string;
    image?: string;
  };
  catalogId?: string;
}

const VendorShopPage = () => {
  const { data: session } = useSession();
  const [shop, setShop] = useState<Shop | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!session?.user?.id) {
      console.log("No user session Id available"); 
      return;
    }

    console.log("Fetching shop data for vendor Id:", session.user.id);

    const fetchShop = async () => {
      try {
        console.log("Making API request to /api/shops");
        const res = await fetch(`/api/shops?vendorId=${session.user.id}`);
        console.log("Api response status:", res.status);
        const data = await res.json();
        console.log('Shop data received:',data);

        if (!res.ok) throw new Error(data.error || "Failed to fetch shop data");

        setShop(Array.isArray(data) ? data[0] : data);
        console.log("Shop state set:", Array.isArray(data) ? data[0] : data);
      } catch (error) {
        console.error("Error fetching shop",error);
      } finally {
        console.log("Setting loading to false");
        setLoading(false);
      }
    };

    fetchShop();
  }, [session]);

  const fetchProducts = async (shopId: string) => {
    try {
      const res = await fetch(`/api/products?shopId=${shopId}`);
      const data = await res.json();
      if (!res.ok) throw new Error("Failed to fetch products");
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchData = async () => {
      if (shop?.id) {
        await fetchProducts(shop.id);
      }
    };

    fetchData();
  }, [session, shop?.id]);

  const handleShopUpdate = async (updatedShop: { name: string; description: string; type: "local_shop" | "grocery_shop" }) => {
    if (!shop) return;
    setIsUpdating(true);

    try {
      const res = await fetch(`/api/shops/${shop.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...updatedShop,
          vendorId: shop.vendorId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update shop");

      setShop((prevShop) => (prevShop ? { ...prevShop, ...updatedShop } : null));
      setIsEditOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddProducts = async (newProducts: Product[]) => {
    setProducts(prevProducts => [...prevProducts, ...newProducts]);
    setIsAddOpen(false);
  };

  const handleProductUpdate = (updatedProduct: Product) => {
    setProducts(prevProducts => 
      prevProducts.map(p => p.id === updatedProduct.id ? 
        { ...p, ...updatedProduct } : p
      )
    );
  };

  const handleProductDelete = (productId: string) => {
    setProducts(prevProducts => 
      prevProducts.filter(p => p.id !== productId)
    );
  };

  if (loading) return (
    <DashboardLayout role="vendor">
      <div className="flex items-center gap-2 p-6 text-white">
        <span>Loading shop data...</span>
        <Spinner />
      </div>
    </DashboardLayout>
  );

  if (!shop) return (
    <DashboardLayout role="vendor">
      <div className="p-6 text-white">No shop found for this vendor.</div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout role="vendor">
      <ShopInfoCard 
        shopId={shop.id} 
        onEdit={() => setIsEditOpen(true)} 
        shopData={shop} 
      />

      {isEditOpen && (
        <EditShopModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          shopData={shop}
          onSave={handleShopUpdate}
          isUpdating={isUpdating}
        />
      )}

      {isAddOpen && (
        <ProductModal
          type="add"
          isOpen={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          shopType={shop.type}
          shopId={shop.id}
          onSubmit={handleAddProducts}
        />
      )}

      <section className="mt-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">Products</h2>
          <button
            onClick={() => setIsAddOpen(true)}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 mb-2 flex items-center gap-2"
            disabled={isUpdating}
          >
            {isUpdating ? (
              <>
                <span>Adding</span>
                <Spinner />
              </>
            ) : (
              '+ Add Product'
            )}
          </button>
        </div>
        <ProductList 
          products={products}
          shopId={shop.id} 
          shopType={shop.type}
          onProductUpdate={handleProductUpdate}
          onProductDelete={handleProductDelete}
        />
      </section>
    </DashboardLayout>
  );
};

export default VendorShopPage;
