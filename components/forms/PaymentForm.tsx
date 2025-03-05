"use client";

import { useState } from "react";

interface PaymentFormProps {
  totalAmount: number;
  onClose: () => void;
}

export default function PaymentForm({ totalAmount, onClose }: PaymentFormProps) {
  const [paymentMethod, setPaymentMethod] = useState<"mpesa" | "airtel" | "cod" | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handlePayment = async () => {
    if (!paymentMethod) {
      setError("Please select a payment method.");
      return;
    }

    if (paymentMethod !== "cod" && phoneNumber.length < 10) {
      setError("Enter a valid phone number.");
      return;
    }

    setLoading(true);
    setError("");

    setTimeout(() => {
      setLoading(false);
      if (paymentMethod === "cod") {
        setSuccess(true);
      } else {
        const paymentSuccess = Math.random() > 0.2; // Simulating success 80% of the time
        if (paymentSuccess) {
          setSuccess(true);
        } else {
          setError("Payment failed. Please try again.");
        }
      }
    }, 2000);
  };

  if (success) {
    window.location.href = "/dashboard/customer/orders";
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96 text-slate-300">
        <h2 className="text-lg font-semibold mb-4">Complete Payment</h2>
        <p className="mb-2">Total: <strong>KSh {totalAmount}</strong></p>

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

        <div className="flex justify-between mt-4">
          <button
            className="p-2 bg-gray-500 rounded"
            onClick={onClose}
          >
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
  );
}
