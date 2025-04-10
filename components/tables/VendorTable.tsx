"use client"

import { FiCheckCircle, FiXCircle, FiTrash2 } from "react-icons/fi"

interface Vendor {
  id: string
  sshopId:string
  name: string
  shop: string
  status: "active" | "inactive"
  category: "local_shop" | "grocery_shop"
}

interface VendorsTableProps {
  vendors: Vendor[]
  toggleVendorStatus: (vendorId: string,newtatus: string) => void
  updateVendorCategory: (vendorId: string, type: "local_shop" | "grocery_shop") => void
  deleteVendorShop: (vendorId: string) => void
}

const VendorsTable = ({ vendors, toggleVendorStatus, updateVendorCategory, deleteVendorShop }: VendorsTableProps) => {
  if (!vendors.length) {
    return <p className="text-center text-gray-400">No vendors available.</p>
  }

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg text-white">
      <table className="w-full">
        <thead>
          <tr className="text-left border-b border-gray-600">
            <th className="p-2">Vendor</th>
            <th className="p-2">Shop</th>
            <th className="p-2">Status</th>
            <th className="p-2">Category</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {vendors.map((vendor) => (
            <tr key={vendor.id} className="border-b border-gray-700">
              <td className="p-2">{vendor.name}</td>
              <td className="p-2">{vendor.shop}</td>
              <td className={`p-2 ${vendor.status === "active" ? "text-green-400" : "text-red-400"}`}>
                {vendor.status}
              </td>
              <td className="p-2">
                <label htmlFor={`vendor-category-${vendor.id}`} className="sr-only">
                  Change Vendor Category
                </label>
                <select
                  id={`vendor-category-${vendor.id}`}
                  value={vendor.category}
                  onChange={(e) => updateVendorCategory(vendor.sshopId, e.target.value as "local_shop" | "grocery_shop")}
                  className="bg-gray-700 p-1 rounded text-white"
                  aria-label="Change Vendor Category"
                  title="Select vendor category"
                >
                  <option value="local_shop">Local Shop</option>
                  <option value="grocery_shop">Grocery Shop</option>
                </select>
              </td>
              <td className="p-2 flex space-x-3">
                {vendor.status === "inactive" ? (
                  <button
                    onClick={() => toggleVendorStatus(vendor.sshopId,'active')}
                    className="text-green-400 hover:text-green-300"
                    title="Activate Vendor"
                    aria-label="Activate Vendor"
                  >
                    <FiCheckCircle size={18} />
                  </button>
                ) : (
                  <button
                    onClick={() => toggleVendorStatus(vendor.sshopId,'inactive')}
                    className="text-red-400 hover:text-red-300"
                    title="Suspend Vendor"
                    aria-label="Suspend Vendor"
                  >
                    <FiXCircle size={18} />
                  </button>
                )}
                <button
                  onClick={() => {
                    if (confirm("Are you sure you want to delete this vendor's shop?")) {
                      deleteVendorShop(vendor.sshopId)
                    }
                  }}
                  title="Delete Shop"
                  aria-label="Delete Shop"
                >
                  <FiTrash2 size={18} className="text-red-200 hover:text-red-300" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default VendorsTable
