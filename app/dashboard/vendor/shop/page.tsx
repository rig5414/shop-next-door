"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "../../../../components/layout/DashboardLayout";
import ProductList from "../../../../components/shop/ProductList";
import ShopInfoCard from "../../../../components/shop/ShopInfoCard";
import EditShopModal from "../../../../components/shop/EditShopModal";
import ProductModal from "../../../../components/shop/ProductModals";
import { useSession } from "next-auth/react";

interface Shop {
  id: string;
  name: string;
  description: string;
  category: string;
  type: "local_shop" | "grocery_shop";
  vendorId: string;
  logo?: string;
}

const VendorShopPage = () => {
  const { data: session } = useSession();
  const [shop, setShop] = useState<Shop | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchShop = async () => {
      try {
        const res = await fetch(`/api/shops?vendorId=${session.user.id}`);
        const data = await res.json();
        console.log('shopOfVendor: ',data);
        if (!res.ok) throw new Error(data.error || "Failed to fetch shop data");

        setShop(Array.isArray(data) ? data[0] : data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchShop();
  }, [session]);

  const handleShopUpdate = async (updatedShop: { name: string; description: string; type: "local_shop" | "grocery_shop" }) => {
    if (!shop) return;

    try {
      const res = await fetch(`/api/shops/${shop.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedShop),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update shop");

      setShop((prevShop) => (prevShop ? { ...prevShop, ...updatedShop } : null));
      setIsEditOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddProducts = async () => {
    setIsAddOpen(false);
  };

  if (loading) return <p className="text-white">Loading shop data...</p>;
  if (!shop) return <p className="text-white">No shop found for this vendor.</p>;

  return (
    <DashboardLayout role="vendor">
      <ShopInfoCard shopId={shop.id} onEdit={() => setIsEditOpen(true)} />

      {isEditOpen && (
        <EditShopModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          shopData={shop}
          onSave={handleShopUpdate}
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
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          >
            + Add Product
          </button>
        </div>
        <ProductList shopId={shop.id} />
      </section>
    </DashboardLayout>
  );
};

export default VendorShopPage;
