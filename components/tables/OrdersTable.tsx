"use client"

import type React from "react"
import { FaEye, FaSort } from "react-icons/fa"
import { useState } from "react"
import type { Order } from "../../app/types"

interface OrdersTableProps {
  orders: Order[];
  onSelectOrder: (order: Order) => void;
  onDeleteOrder: (orderId: string) => void;
}

const TABLE_HEADERS: { key: string; label: string }[] = [
  { key: "id", label: "Order ID" },
  { key: "customer", label: "Customer" },
  { key: "shop", label: "Shop" },
  { key: "total", label: "Total (Ksh.)" },
  { key: "paymentStatus", label: "Payment Status" },
  { key: "status", label: "Order Status" },
]

const getPaymentStatusColor = (status: string | undefined) => {
  if (!status) return "bg-gray-500";
  
  const normalizedStatus = status.toLowerCase();

  const mappedStatus = 
  normalizedStatus === "successful" ? "paid" : normalizedStatus;

  return mappedStatus === "paid" ? "bg-green-600" : 
         mappedStatus === "pending" ? "bg-yellow-500" : 
         "bg-red-600";
}

const getOrderStatusColor = (status: string | undefined) => {
  if (!status) return "bg-gray-500";
  
  const normalizedStatus = status.toLowerCase();
  return normalizedStatus === "completed" ? "bg-green-600" : 
         normalizedStatus === "pending" ? "bg-yellow-500" : 
         normalizedStatus === "shipped" ? "bg-blue-500" : 
         "bg-red-600";
}

const OrdersTable: React.FC<OrdersTableProps> = ({ orders, onSelectOrder, onDeleteOrder }) => {
  const [sortBy, setSortBy] = useState<string>("id")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(key)
      setSortOrder("asc")
    }
  }

  const sortedOrders = [...orders].sort((a, b) => {
    let valA, valB
    const key = sortBy

    if (key === "customer") {
      valA = a.customer.name
      valB = b.customer.name
    } else if (key === "shop") {
      valA = a.shop.name
      valB = b.shop.name
    } else {
      valA = a[sortBy as keyof Order]
      valB = b[sortBy as keyof Order]
    }

    if (typeof valA === "number" && typeof valB === "number") {
      return sortOrder === "asc" ? valA - valB : valB - valA
    }

    return sortOrder === "asc" ? String(valA).localeCompare(String(valB)) : String(valB).localeCompare(String(valA))
  })

  return (
    <div className="bg-gray-900 text-white rounded-lg p-4 shadow-md">
      <h3 className="text-xl font-semibold mb-4">Orders List</h3>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-700">
          <thead className="bg-gray-800">
            <tr>
              {TABLE_HEADERS.map(({ key, label }) => (
                <th
                  key={key}
                  className="border border-gray-700 px-4 py-2 cursor-pointer"
                  onClick={() => handleSort(key)}
                >
                  {label}
                  <FaSort className="inline ml-2" />
                </th>
              ))}
              <th className="border border-gray-700 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
           {sortedOrders.map((order) => {
            console.log('Order object:', order);

            const paymentStatus = (order as any).transaction?.status || 'N/A';
            console.log('Payment Status value:', paymentStatus);
    
          return (
           <tr key={order.id} className="hover:bg-gray-800 transition">
           <td className="border border-gray-700 px-4 py-2 text-blue-400 cursor-pointer">#{order.id}</td>
           <td className="border border-gray-700 px-4 py-2">{order.customer.name}</td>
           <td className="border border-gray-700 px-4 py-2">{order.shop.name}</td>
           <td className="border border-gray-700 px-4 py-2">KSh {Number(order.total).toFixed(2)}</td>
           <td className="border border-gray-700 px-4 py-2">
            <span className={`px-2 py-1 rounded text-sm ${getPaymentStatusColor(paymentStatus)}`}>
             {paymentStatus || 'N/A'}
            </span>
           </td>
           <td className="border border-gray-700 px-4 py-2">
            <span className={`px-2 py-1 rounded text-sm ${getOrderStatusColor(order.status)}`}>
             {order.status}
            </span>
           </td>
           <td className="border border-gray-700 px-4 py-2 flex gap-3">
          {/* View Order */}
          <button
            onClick={() => onSelectOrder(order)}
            className="text-blue-400 hover:text-blue-300"
            aria-label={`View order #${order.id}`}
            title="View Order"
          >
            <FaEye size={16} />
          </button>
          </td>
          </tr>
         );
         })}
        </tbody>
       </table>
      </div>
    </div>
  )
}

export default OrdersTable
