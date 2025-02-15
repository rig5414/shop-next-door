"use client";
import { useState } from "react";

const PlatformConfigForm = () => {
  const [config, setConfig] = useState({
    enableMarketplace: true,
    allowGuestCheckout: false,
    enableReviews: true,
  });

  const handleToggle = (key: keyof typeof config) => {
    setConfig((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-md max-w-lg">
      <h2 className="text-xl font-semibold text-white mb-4">Platform Configuration</h2>

      {/* Toggle - Enable Marketplace */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-300">Enable Marketplace</span>
        <button
          aria-label={`Toggle Enable Marketplace (currently ${config.enableMarketplace ? "on" : "off"})`}
          className={`w-12 h-6 flex items-center rounded-full p-1 ${
            config.enableMarketplace ? "bg-green-500" : "bg-gray-500"
          }`}
          onClick={() => handleToggle("enableMarketplace")}
        >
          <div
            className={`w-4 h-4 bg-white rounded-full transform transition-transform ${
              config.enableMarketplace ? "translate-x-6" : ""
            }`}
          ></div>
        </button>
      </div>

      {/* Toggle - Allow Guest Checkout */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-300">Allow Guest Checkout</span>
        <button
          aria-label={`Toggle Allow Guest Checkout (currently ${config.allowGuestCheckout ? "on" : "off"})`}
          className={`w-12 h-6 flex items-center rounded-full p-1 ${
            config.allowGuestCheckout ? "bg-green-500" : "bg-gray-500"
          }`}
          onClick={() => handleToggle("allowGuestCheckout")}
        >
          <div
            className={`w-4 h-4 bg-white rounded-full transform transition-transform ${
              config.allowGuestCheckout ? "translate-x-6" : ""
            }`}
          ></div>
        </button>
      </div>

      {/* Toggle - Enable Reviews */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-300">Enable Reviews</span>
        <button
          aria-label={`Toggle Enable Reviews (currently ${config.enableReviews ? "on" : "off"})`}
          className={`w-12 h-6 flex items-center rounded-full p-1 ${
            config.enableReviews ? "bg-green-500" : "bg-gray-500"
          }`}
          onClick={() => handleToggle("enableReviews")}
        >
          <div
            className={`w-4 h-4 bg-white rounded-full transform transition-transform ${
              config.enableReviews ? "translate-x-6" : ""
            }`}
          ></div>
        </button>
      </div>

      {/* Save Button */}
      <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
        Save Changes
      </button>
    </div>
  );
};

export default PlatformConfigForm;
