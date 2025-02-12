import { useState } from "react";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";

interface Vendor {
  id: string;
  name: string;
  shop: string;
  status: "Approved" | "Pending" | "Suspended";
}

const sampleVendors: Vendor[] = [
  { id: "1", name: "Sarah Lee", shop: "Sarah's Boutique", status: "Approved" },
  { id: "2", name: "Tom Carter", shop: "Tom's Electronics", status: "Pending" },
  { id: "3", name: "Emily Green", shop: "Emily's Fashion", status: "Suspended" },
];

const VendorsTable = () => {
  const [vendors, setVendors] = useState(sampleVendors);

  const toggleVendorStatus = (id: string) => {
    setVendors((prev) =>
      prev.map((vendor) =>
        vendor.id === id
          ? {
              ...vendor,
              status: vendor.status === "Approved" ? "Suspended" : "Approved",
            }
          : vendor
      )
    );
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg text-white">
      <table className="w-full">
        <thead>
          <tr className="text-left border-b border-gray-600">
            <th className="p-2">Vendor</th>
            <th className="p-2">Shop</th>
            <th className="p-2">Status</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {vendors.map((vendor) => (
            <tr key={vendor.id} className="border-b border-gray-700">
              <td className="p-2">{vendor.name}</td>
              <td className="p-2">{vendor.shop}</td>
              <td className={`p-2 ${vendor.status === "Approved" ? "text-green-400" : "text-yellow-400"}`}>
                {vendor.status}
              </td>
              <td className="p-2 flex space-x-3">
               {vendor.status === "Pending" || vendor.status === "Suspended" ? (
               <button onClick={() => toggleVendorStatus(vendor.id)} className="text-green-400 hover:text-green-300"
                title="Approve Vendor" aria-label="Approve Vendor">
                  <FiCheckCircle size={18} />
               </button>) : (
               <button onClick={() => toggleVendorStatus(vendor.id)} className="text-red-400 hover:text-red-300"
                title="Suspend Vendor" aria-label="Suspend Vendor">
                  <FiXCircle size={18} />
               </button>
                )}
             </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VendorsTable;
