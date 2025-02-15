"use client";
import { useState } from "react";

const TransactionSettingsForm = () => {
  const [settings, setSettings] = useState({
    transactionFees: 2.5,
    refundPolicy: "No refunds after 30 days",
    taxVatRules: "Standard VAT of 10%",
    discountPromoHandling: "Allow stackable discounts",
  });

  const handleChange = (key: keyof typeof settings, value: string | number) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-md max-w-lg">
      <h2 className="text-xl font-semibold text-white mb-4">Transaction Settings</h2>

      {/* Transaction Fees */}
      <div className="mb-4">
        <label htmlFor="transactionFees" className="text-gray-300 block mb-1">Transaction Fees (%)</label>
        <input
          id="transactionFees"
          type="number"
          value={settings.transactionFees}
          onChange={(e) => handleChange("transactionFees", parseFloat(e.target.value))}
          placeholder="Enter transaction fee percentage"
          title="Transaction Fee Percentage"
          className="w-full p-2 rounded bg-gray-700 text-white"
        />
      </div>

      {/* Refund Policy */}
      <div className="mb-4">
        <label htmlFor="refundPolicy" className="text-gray-300 block mb-1">Refund Policy</label>
        <textarea
          id="refundPolicy"
          value={settings.refundPolicy}
          onChange={(e) => handleChange("refundPolicy", e.target.value)}
          placeholder="Enter refund policy details"
          title="Refund Policy Description"
          className="w-full p-2 rounded bg-gray-700 text-white"
        />
      </div>

      {/* Tax & VAT Rules */}
      <div className="mb-4">
        <label htmlFor="taxVatRules" className="text-gray-300 block mb-1">Tax & VAT Rules</label>
        <input
          id="taxVatRules"
          type="text"
          value={settings.taxVatRules}
          onChange={(e) => handleChange("taxVatRules", e.target.value)}
          placeholder="Specify tax and VAT rules"
          title="Tax & VAT Rules"
          className="w-full p-2 rounded bg-gray-700 text-white"
        />
      </div>

      {/* Discount & Promo Handling */}
      <div className="mb-4">
        <label htmlFor="discountPromoHandling" className="text-gray-300 block mb-1">Discount & Promo Handling</label>
        <input
          id="discountPromoHandling"
          type="text"
          value={settings.discountPromoHandling}
          onChange={(e) => handleChange("discountPromoHandling", e.target.value)}
          placeholder="Describe discount and promo handling"
          title="Discount & Promo Handling"
          className="w-full p-2 rounded bg-gray-700 text-white"
        />
      </div>

      {/* Save Button */}
      <button 
        className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
        title="Save Transaction Settings"
      >
        Save Changes
      </button>
    </div>
  );
};

export default TransactionSettingsForm;
