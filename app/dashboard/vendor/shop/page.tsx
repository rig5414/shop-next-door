"use client";

import { useState } from "react";
import DashboardLayout from "../../../../components/layout/DashboardLayout";
import ProductList from "../../../../components/shop/ProductList";
import ShopInfoCard from "../../../../components/shop/ShopInfoCard";
import EditShopModal from "../../../../components/shop/EditShopModal";

const VendorShopPage = () => {
  const [shop, setShop] = useState({
    name: "Jane's Boutique",
    description: "Trendy fashion for all seasons.",
    category: "Clothing",
    logo: "/shop-logo.png",
  });

  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <DashboardLayout role="vendor">
      {/* Shop Header */}
      <ShopInfoCard 
       name={shop.name}
       description={shop.description}
       category={shop.category}
       logo={shop.logo}
       onEdit={() => setIsEditOpen(true)} 
      />

      {/* Edit Shop Modal */}
      {isEditOpen && (
        <EditShopModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          shopData={shop}  // ✅ Fix: Pass `shopData` instead of `shop`
          onSave={(updatedShop) => setShop(updatedShop)}
        />
      )}

      {/* Product Management Section */}
      <section className="mt-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">Products</h2>
          <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
            + Add Product
          </button>
        </div>
        <ProductList />
      </section>
    </DashboardLayout>
  );
};

export default VendorShopPage;
