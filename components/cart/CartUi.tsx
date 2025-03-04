"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { ShoppingCart, Plus, Minus, X, Trash } from "lucide-react";
import PaymentForm from "../forms/PaymentForm";

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

interface CartUiProps {
  cartItems: CartItem[];
  setCartItems: Dispatch<SetStateAction<CartItem[]>>;
  cartOpen: boolean;
  setCartOpen: Dispatch<SetStateAction<boolean>>;
}

export default function CartUi({
  cartItems,
  setCartItems,
  cartOpen,
  setCartOpen,
}: CartUiProps) {
  const [deliveryOption, setDeliveryOption] = useState<"with" | "self" | null>(
    null
  );
  const [deliveryError, setDeliveryError] = useState("");
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const updateQuantity = (id: string, change: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(1, item.quantity + change) }
            : item
        )
    );
  };

  const removeItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const deliveryFee = deliveryOption === "with" && totalPrice >= 500 ? Math.round(totalPrice * 0.15) : 0;
  const finalTotal = totalPrice + deliveryFee;

  return (
    <>
      {/* Floating Cart Button */}
      <button
        onClick={() => setCartOpen(true)}
        className="fixed bottom-5 right-5 bg-blue-600 text-slate-300 p-3 rounded-full shadow-lg flex items-center gap-2"
        aria-label="Open shopping cart"
      >
        <ShoppingCart size={20} />
        {cartItems.length > 0 && (
          <span className="bg-red-500 text-slate-300 text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {cartItems.length}
          </span>
        )}
      </button>

      {/* Cart Panel */}
      {cartOpen && (
        <div className="fixed bottom-0 right-0 w-96 bg-gray-800 shadow-xl p-5 rounded-t-lg border text-slate-300">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold">Shopping Cart</h2>
            <button onClick={() => setCartOpen(false)} aria-label="Close shopping cart">
              <X size={20} />
            </button>
          </div>

          {cartItems.length === 0 ? (
            <p className="text-gray-500 text-sm">Your cart is empty.</p>
          ) : (
            <>
              <div className="max-h-60 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between py-2 border-b">
                    <span>{item.name}</span>
                    <div className="flex items-center gap-2">
                      <button
                        className="p-1 bg-slate-950 rounded"
                        onClick={() => updateQuantity(item.id, -1)}
                        aria-label={`Decrease quantity of ${item.name}`}
                      >
                        <Minus size={12} />
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        className="p-1 bg-slate-950 rounded"
                        onClick={() => updateQuantity(item.id, 1)}
                        aria-label={`Increase quantity of ${item.name}`}
                      >
                        <Plus size={12} />
                      </button>
                      <span>KSh {item.price * item.quantity}</span>
                      <button
                        className="p-1 bg-red-600 text-white rounded"
                        onClick={() => removeItem(item.id)}
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        <Trash size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing Summary */}
              <div className="mt-3 p-3 border-t">
                <p className="flex justify-between">
                  <span>Subtotal:</span> <span>KSh {totalPrice}</span>
                </p>
                <p className="flex justify-between">
                  <span>Delivery fee:</span> <span>KSh {deliveryFee}</span>
                </p>
                <p className="flex justify-between font-semibold">
                  <span>Total:</span> <span>KSh {finalTotal}</span>
                </p>
              </div>

              {/* Delivery Options */}
              <div className="flex gap-2 mt-3">
                <button
                  className={`p-2 rounded ${
                    deliveryOption === "with"
                      ? "bg-blue-600 text-slate-300"
                      : totalPrice < 500
                      ? "bg-gray-300 text-gray-500 opacity-50"
                      : "bg-green-600 text-slate-300"
                  }`}
                  disabled={totalPrice < 500}
                  onClick={() => {
                    setDeliveryOption(deliveryOption === "with" ? null : "with");
                    setDeliveryError("");
                  }}
                >
                  {deliveryOption === "with" ? "Without Delivery" : "With Delivery"}
                </button>
                <button
                  className={`p-2 rounded ${
                    deliveryOption === "self"
                      ? "bg-blue-600 text-slate-300"
                      : "bg-gray-200 text-black"
                  }`}
                  onClick={() => {
                    setDeliveryOption("self");
                    setDeliveryError("");
                  }}
                >
                  Self Pickup
                </button>
              </div>

              {/* Delivery Error Message */}
              {deliveryError && <p className="text-red-500 text-sm mt-2">{deliveryError}</p>}

              {/* Proceed to Payment */}
              <button
                className={`w-full mt-3 p-2 rounded ${
                  deliveryOption ? "bg-green-600 text-slate-300" : "bg-gray-300 text-gray-500 opacity-50"
                }`}
                disabled={!deliveryOption}
                onClick={() => setShowPaymentForm(true)}
                aria-label="Proceed to payment"
              >
                Proceed with Payment
              </button>
            </>
          )}
        </div>
      )}
      {/* Payment Form Modal */}
      {showPaymentForm && (
        <PaymentForm totalAmount={finalTotal} onClose={() => setShowPaymentForm(false)} />
      )}
    </>
  );
}
