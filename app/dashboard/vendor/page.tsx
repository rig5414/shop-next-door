"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "../../../components/layout/DashboardLayout"
import DashboardHeader from "../../../components/dashboard/DashboardHeader"
import DashboardStats from "../../../components/dashboard/DashboardStats"
import ProductList from "../../../components/shop/ProductList"
import OrderList from "../../../components/orders/OrderList"
import OrderDetailsDrawer from "../../../components/orders/OrderDetailsDrawer"
import SalesChart from "../../../components/dashboard/charts/SalesChart"
import BestSellingChart from "../../../components/dashboard/charts/BestSellingChart"
import RevenueChart from "../../../components/dashboard/charts/RevenueChart"
import CustomerFrequencyChart from "../../../components/dashboard/charts/CustomerFrequencyChart"
import OrdersChart from "../../../components/dashboard/charts/OrdersChart"
import { useSession } from "next-auth/react"
import type { Order, OrderStatus } from "../../types"
import { useProfile } from "../../../components/profile/ProfileContext"
import ErrorBoundary from "../../../components/auth/ErrorBoundary"

// Define a ShopProduct interface to match your actual product data structure
// This is different from the Product type in types.ts
interface ShopProduct {
  id: string
  name?: string
  price: number
  stock: number
  image?: string
  catalog?: {
    id: string
    name: string
    description?: string
    defaultPrice?: string
    image?: string
  }
  catalogId?: string
}

// Add this helper function at the top (like in orders page)
const normalizeStatus = (status: string): string => {
  return status.toLowerCase();
};

const VendorDashboard = () => {
  const { data: session } = useSession()
  const { profile } = useProfile()
  const vendorId = session?.user?.id

  const [shopOpen, setShopOpen] = useState(true)
  const [orders, setOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<ShopProduct[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [shopId, setShopId] = useState("")
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    pendingOrders: 0,
  })

  console.log("Vendor ID:", vendorId)
  console.log("Shop ID:", shopId)

  // Fetch Shop ID first
  useEffect(() => {
    const fetchShop = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/shops?vendorId=${vendorId}`)
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || "Failed to fetch shop data")
        console.log("data for the shop: ", data)
        if (data && data.length > 0) {
          setShopId(data[0].id)
          setShopOpen(data[0].status === "active")
        }
      } catch (error) {
        console.error("Error fetching shop:", error)
      } finally {
        setLoading(false)
      }
    }

    if (vendorId) {
      fetchShop()
    }
  }, [vendorId])

  // Fetch Orders once vendorId is available
  useEffect(() => {
    if (!vendorId) return

    const fetchOrders = async () => {
      try {
        const res = await fetch(`/api/orders?vendorId=${vendorId}`)
        const data = await res.json()
        setOrders(data)

        // Calculate stats from orders
        const totalSales = data.reduce((sum: number, order: Order) => {
          return sum + (order.status.toLowerCase() === "completed" ? Number(order.total) || 0 : 0)
        }, 0)

        const pendingOrders = data.filter((order: Order) => order.status.toLowerCase() === "pending").length

        setStats({
          totalSales,
          totalOrders: data.length,
          pendingOrders,
        })
      } catch (error) {
        console.error("Error fetching orders:", error)
      }
    }

    fetchOrders()
  }, [vendorId])

  // Fetch Products ONLY after shopId is available
  useEffect(() => {
    if (!shopId) return

    const fetchProducts = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/products?shopId=${shopId}`)
        const data = await res.json()
        setProducts(data)
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [shopId])

  const toggleShopStatus = async () => {
    try {
      const newStatus = shopOpen ? "inactive" : "active"

      // Only send status and vendorId (for authorization)
      const res = await fetch(`/api/shops/${shopId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          vendorId: vendorId,
        }),
      })

      if (!res.ok) {
        throw new Error("Failed to update shop status")
      }

      setShopOpen(!shopOpen)
    } catch (error) {
      console.error("Error updating shop status:", error)
    }
  }

  const handleOpenDrawer = (order: Order) => {
    setSelectedOrder(order)
    setIsDrawerOpen(true)
  }

  const handleCloseDrawer = () => {
    setSelectedOrder(null)
    setIsDrawerOpen(false)
  }

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      // Update status on the server first (matching orders page implementation)
      const response = await fetch(`/api/orders`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          id: orderId, 
          status: normalizeStatus(newStatus) // Normalize status before sending
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update order status");
      }

      // Update local state and stats
      setOrders((prevOrders) =>
        prevOrders.map((order) => {
          if (order.id === orderId) {
            // Update stats when changing from/to pending status
            if (order.status.toLowerCase() === "pending") {
              setStats(prev => ({
                ...prev,
                pendingOrders: prev.pendingOrders - 1
              }));
            }
            if (newStatus.toLowerCase() === "pending") {
              setStats(prev => ({
                ...prev,
                pendingOrders: prev.pendingOrders + 1
              }));
            }
            return { ...order, status: newStatus };
          }
          return order;
        })
      );

      handleCloseDrawer();
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      // Delete on the server first (matching orders page implementation)
      const response = await fetch(`/api/orders`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          id: orderId,
          role: "admin" // Match the working implementation
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete order");
      }

      // Update local state and stats
      setOrders((prevOrders) => {
        const orderToDelete = prevOrders.find(order => order.id === orderId);
        if (orderToDelete) {
          setStats(prev => ({
            ...prev,
            totalOrders: prev.totalOrders - 1,
            pendingOrders: orderToDelete.status.toLowerCase() === "pending" 
              ? prev.pendingOrders - 1 
              : prev.pendingOrders,
            totalSales: orderToDelete.status.toLowerCase() === "completed"
              ? prev.totalSales - Number(orderToDelete.total)
              : prev.totalSales
          }));
        }
        return prevOrders.filter(order => order.id !== orderId);
      });

      handleCloseDrawer();
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const handleRefundOrder = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/refund`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to process refund")
      }

      // Update local state
      setOrders(orders.map((order) => (order.id === orderId ? { ...order, isRefunded: true } : order)))
    } catch (error) {
      console.error("Error processing refund:", error)
    }
  }

  // Get a subset of products for the dashboard (3-5 random products)
  const getRandomProducts = (products: ShopProduct[], count = 3): ShopProduct[] => {
    if (products.length <= count) return products

    // Shuffle array and take first 'count' elements
    return [...products].sort(() => 0.5 - Math.random()).slice(0, count)
  }

  const displayProducts = getRandomProducts(products, 3)

  return (
    <DashboardLayout role="vendor">
      <DashboardHeader
        title={`Welcome, ${profile.firstName} ${profile.lastName}!`}
        subtitle="Manage your products and track sales."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        <DashboardStats title="Total Sales" value={`Ksh. ${stats.totalSales.toLocaleString()}`} />
        <DashboardStats title="Total Orders" value={stats.totalOrders.toString()} />
        <DashboardStats title="Pending Orders" value={stats.pendingOrders.toString()} />
      </div>

      <div className="mt-6 p-4 bg-gray-800 rounded-lg flex items-center justify-between">
        <span className="text-white text-lg">Shop Status: {shopOpen ? "Open 🟢" : "Closed 🔴"}</span>
        <button
          onClick={toggleShopStatus}
          className={`px-4 py-2 rounded-md font-semibold ${
            shopOpen ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {shopOpen ? "Close Shop" : "Open Shop"}
        </button>
      </div>

      <section className="mt-6">
        <h2 className="text-xl font-semibold text-white">Sales Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          <ErrorBoundary>
            <SalesChart className="w-full h-full transition duration-300 hover:shadow-[0_0_20px_rgba(0,255,255,0.5)]" />
          </ErrorBoundary>
          <ErrorBoundary>
            <BestSellingChart className="w-full h-full transition duration-300 hover:shadow-[0_0_20px_rgba(0,255,255,0.5)]" />
          </ErrorBoundary>
          <ErrorBoundary>
            <RevenueChart className="w-full h-full transition duration-300 hover:shadow-[0_0_20px_rgba(0,255,255,0.5)]" />
          </ErrorBoundary>
          <ErrorBoundary>
            <OrdersChart className="w-full h-full transition duration-300 hover:shadow-[0_0_20px_rgba(0,255,255,0.5)]" />
          </ErrorBoundary>
          <ErrorBoundary>
            <CustomerFrequencyChart className="w-full h-full md:col-span-2 transition duration-300 hover:shadow-[0_0_20px_rgba(0,255,255,0.5)]" />
          </ErrorBoundary>
        </div>
      </section>

      <section className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Your Products</h2>
        </div>
        {loading ? (
          <p className="text-gray-400">Loading products...</p>
        ) : (
          <>
            {displayProducts.length > 0 ? (
              <ProductList products={displayProducts} shopId={shopId} shopType="local_shop" />
            ) : (
              <p className="text-gray-400">No products available.</p>
            )}
          </>
        )}
      </section>

      <section className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Recent Orders</h2>
        </div>
        {orders.length > 0 ? (
          <OrderList orders={orders.slice(0, 5)} onOpenModal={handleOpenDrawer} />
        ) : (
          <p className="text-gray-400">No orders available.</p>
        )}
      </section>

      {/* Order Details Drawer */}
      {isDrawerOpen && selectedOrder && (
        <OrderDetailsDrawer
          order={selectedOrder}
          onClose={handleCloseDrawer}
          onUpdateStatus={handleUpdateStatus}
          onRefund={handleRefundOrder}
          onDelete={handleDeleteOrder}
        />
      )}
    </DashboardLayout>
  )
}

export default VendorDashboard

