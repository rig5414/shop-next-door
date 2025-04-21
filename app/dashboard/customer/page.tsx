"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import DashboardLayout from "../../../components/layout/DashboardLayout"
import DashboardHeader from "../../../components/dashboard/DashboardHeader"
import DashboardStats from "../../../components/dashboard/DashboardStats"
import OrderList from "../../../components/orders/OrderList"
import ProductList from "../../../components/shop/ProductList"
import OrderDetailsModal from "../../../components/orders/OrderDetailsModal"
import Link from "next/link"
import { FiShoppingBag } from "react-icons/fi"
import type { Order, Product } from "../../types"
import type { ShopStatus } from "@prisma/client"

type Shop = {
  id: string
  name: string
  description: string
  status: ShopStatus
}

const CustomerDashboard = () => {
  const { data: session, status } = useSession()
  const [customerName, setCustomerName] = useState("User")
  const [openShops, setOpenShops] = useState<Shop[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([])
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalSpent: 0,
  })

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(false)
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [shopsLoading, setShopsLoading] = useState(true)

  useEffect(() => {
    if (status !== "authenticated" || !session?.user) return

    setCustomerName(session.user.name || "User")
    fetchOrders(session.user.id)
    fetchShops()
    fetchProducts()

    // Event listener for profile updates
    const handleProfileUpdate = (event: Event) => {
      const customEvent = event as CustomEvent
      const updatedProfile = customEvent.detail
      console.log("Profile update event received:", updatedProfile)

      if (updatedProfile.name) {
        setCustomerName(updatedProfile.name)
        console.log("Updated name to:", updatedProfile.name)
      }
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, [session, status])

  const fetchOrders = async (customerId: string) => {
    setOrdersLoading(true)
    try {
      const res = await fetch(`/api/orders?customerId=${customerId}`)
      const data = await res.json()

      console.log("Fetched Orders Data:", data)

      if (!Array.isArray(data)) {
        console.error("Orders API did not return an array. Response:", data)
        setOrders([])
        return
      }

      // Debug the actual field names in the first order
      if (data.length > 0) {
        console.log("First order fields:", Object.keys(data[0]))
        console.log("First order status value:", data[0].status)
      }

      // Use status field instead of orderStatus
      const pendingOrders = data.filter((order) => {
        if (!order.status) return false

        const statusLower = String(order.status).toLowerCase()
        const isPending = statusLower === "pending"

        console.log(`Order ${order.id}: Status "${order.status}" isPending: ${isPending}`)
        return isPending
      }).length

      const totalOrders = data.length
      const totalSpent = data.reduce((sum, order) => sum + (Number(order.total) || 0), 0)

      console.log(`Setting stats - Total: ${totalOrders}, Pending: ${pendingOrders}, Spent: ${totalSpent}`)

      setOrders(data)
      setStats({
        totalOrders,
        pendingOrders,
        totalSpent: isNaN(totalSpent) ? 0 : totalSpent,
      })
    } catch (error) {
      console.error("Error fetching orders:", error)
      setOrders([])
    } finally {
      setOrdersLoading(false)
    }
  }

  const fetchShops = async () => {
    setShopsLoading(true)
    try {
      const res = await fetch("/api/shops")
      const data: Shop[] = await res.json()

      console.log("Fetched Shops Data:", data)

      if (!Array.isArray(data)) {
        console.error("Shops API did not return an array. Response:", data)
        setOpenShops([])
        return
      }

      const openShops = data.filter((shop) => shop.status.toLowerCase() === "active")
      setOpenShops(openShops)
    } catch (error) {
      console.error("Error fetching shops:", error)
      setOpenShops([])
    } finally {
      setShopsLoading(false)
    }
  }

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/product-catalog")
      const data: Product[] = await res.json()

      console.log("Fetched Products Data:", data)

      if (!Array.isArray(data)) {
        console.warn("Product Catalog API did not return an array. Response:", data)
        setRecommendedProducts([])
        return
      }

      setRecommendedProducts(data.sort(() => 0.5 - Math.random()).slice(0, 6))
    } catch (error) {
      console.error("Error fetching products:", error)
      setRecommendedProducts([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout role="customer">
      <DashboardHeader title={`Welcome, ${customerName}!`} subtitle="Here's what's happening today." />

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        <DashboardStats title="Total Orders" value={stats.totalOrders.toString()} />
        <DashboardStats title="Pending Orders" value={stats.pendingOrders.toString()} />
        <DashboardStats
          title="Total Spent"
          value={`Ksh. ${stats.totalSpent ? stats.totalSpent.toLocaleString() : "0"}`}
        />
      </div>

      {/* Recent Orders */}
      <section className="mt-6">
        <h2 className="text-xl font-semibold text-white">Recent Orders</h2>
        {ordersLoading ? (
          <div className="flex items-center gap-2 text-gray-400">
            Loading Orders...
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : orders.length > 0 ? (
          <OrderList orders={orders} onOpenModal={setSelectedOrder} />
        ) : (
          <p className="text-gray-400">No orders found.</p>
        )}
      </section>

      {/* Recommended Products */}
      <section className="mt-6">
        <h2 className="text-xl font-semibold text-white">Recommended for You</h2>
        {loading ? (
          <div className="flex items-center gap-2 text-gray-400">
            Loading Products...
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : recommendedProducts.length > 0 ? (
          <ProductList products={recommendedProducts.map((product) => ({ ...product, stock: 0 }))} hidePriceAndStock />
        ) : (
          <p className="text-gray-400">No products available.</p>
        )}
      </section>

      {/* Open Shops Section */}
      <section className="mt-6 bg-gray-800 p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-white mb-3">Open Shops</h2>
        {shopsLoading ? (
          <div className="flex items-center gap-2 text-gray-400">
            Loading Shops...
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {openShops.length > 0 ? (
              openShops.map((shop) => (
                <Link
                  key={shop.id}
                  href={`/dashboard/customer/shops/${shop.id}`}
                  className="block bg-gray-900 p-4 rounded-md hover:bg-gray-700 transition"
                >
                  <div className="flex items-center">
                    <FiShoppingBag className="text-blue-400 w-6 h-6 mr-3" />
                    <div>
                      <h4 className="text-lg font-medium text-white">{shop.name}</h4>
                      <p className="text-sm text-gray-400">{shop.description}</p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-gray-400">No open shops available.</p>
            )}
          </div>
        )}
      </section>

      {/* Order Details Modal */}
      {selectedOrder && <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />}
    </DashboardLayout>
  )
}

export default CustomerDashboard

