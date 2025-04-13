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

  // Phone number formatter function
  const formatPhoneNumber = (phone: string): string => {
    // Remove any non-digit characters
    const cleaned = phone.replace(/\D/g, '')
    // Remove leading 0 if present and add 254
    return cleaned.replace(/^0/, '254')
  }

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
          paymentMethod,
          phoneNumber: paymentMethod !== "cod" ? formatPhoneNumber(phoneNumber) : null,
          status: "pending"
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create order")
      }

      return await response.json()
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "An unknown error occurred")
    }
  }

  const initiateMpesaPayment = async (formattedPhone: string, orderId: string) => {
    try {
      const response = await fetch('/api/mpesa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: formattedPhone,
          amount: totalAmount,
          orderId,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to initiate M-Pesa payment')
      }

      return await response.json()
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Payment failed')
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
      // Create order first
      const order = await createOrder()
      console.log("Order created:", order)

      if (paymentMethod === "mpesa") {
        // Format phone number and initiate STK push
        const formattedPhone = formatPhoneNumber(phoneNumber)
        const mpesaResponse = await initiateMpesaPayment(formattedPhone, order.id)
        
        if (mpesaResponse.success) {
          setSuccess(true)
          setTimeout(() => {
            window.location.href = "/dashboard/customer/orders"
          }, 500)
        } else {
          throw new Error(mpesaResponse.error || 'Payment failed')
        }
      } else if (paymentMethod === "airtel") {
        // Implement Airtel Money logic here
        throw new Error("Airtel Money integration coming soon")
      } else if (paymentMethod === "cod") {
        setSuccess(true)
        setTimeout(() => {
          window.location.href = "/dashboard/customer/orders"
        }, 500)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process payment")
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

