"use client"

import { useState } from "react"

interface Item {
  productId: string
  quantity: number
  price: number
}

interface PaymentFormProps {
  totalAmount: number
  onClose: () => void
  customerId: string
  shopId: string
  items: Item[]
}

export default function PaymentForm({ totalAmount, onClose, customerId, shopId, items }: PaymentFormProps) {
  const [paymentMethod, setPaymentMethod] = useState<"mpesa" | "airtel" | "cod" | null>(null)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const createOrder = async () => {
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId,
          shopId,
          items,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create order")
      }

      return await response.json()
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message)
      }
      throw new Error("An unknown error occurred")
    }
  }

  const handlePayment = async () => {
    if (!paymentMethod) {
      setError("Please select a payment method.")
      return
    }

    if (paymentMethod !== "cod" && phoneNumber.length < 10) {
      setError("Enter a valid phone number.")
      return
    }

    setLoading(true)
    setError("")

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      if (paymentMethod === "cod" || Math.random() > 0.2) {
        // Simulating success 80% of the time
        // Create the order in the database
        const order = await createOrder()
        console.log("Order created:", order)
        setSuccess(true)

        // Redirect after a short delay to ensure the user sees the success state
        setTimeout(() => {
          window.location.href = "/dashboard/customer/orders"
        }, 500)
      } else {
        setError("Payment failed. Please try again.")
        setLoading(false)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create order")
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96 text-slate-300">
        <h2 className="text-lg font-semibold mb-4">Complete Payment</h2>
        <p className="mb-2">
          Total: <strong>KSh {totalAmount}</strong>
        </p>

        <div className="mb-4">
          <label className="block mb-2">Select Payment Method:</label>
          <div className="flex gap-2">
            <button
              className={`p-2 rounded ${paymentMethod === "mpesa" ? "bg-green-600" : "bg-gray-700"}`}
              onClick={() => setPaymentMethod("mpesa")}
            >
              Mpesa
            </button>
            <button
              className={`p-2 rounded ${paymentMethod === "airtel" ? "bg-red-600" : "bg-gray-700"}`}
              onClick={() => setPaymentMethod("airtel")}
            >
              Airtel
            </button>
            <button
              className={`p-2 rounded ${paymentMethod === "cod" ? "bg-blue-600" : "bg-gray-700"}`}
              onClick={() => setPaymentMethod("cod")}
            >
              Cash on Delivery/Pick-up
            </button>
          </div>
        </div>

        {paymentMethod && paymentMethod !== "cod" && (
          <div className="mb-4">
            <label className="block mb-2">Enter Phone Number:</label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full p-2 bg-gray-700 rounded"
              placeholder="e.g. 07xxxxxxxx"
            />
          </div>
        )}

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">Order created successfully!</p>}

        <div className="flex justify-between mt-4">
          <button className="p-2 bg-gray-500 rounded" onClick={onClose}>
            Cancel
          </button>
          <button
            className={`p-2 rounded ${loading ? "bg-gray-500" : "bg-green-600"}`}
            onClick={handlePayment}
            disabled={loading}
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </div>
      </div>
    </div>
  )
}

