"use client";

import { useState } from "react";

const CustomerNotificationSettings = () => {
  return (
    <div className="bg-gray-900 p-4 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-white">Notification Preferences</h2>

      <div className="mt-4 space-y-4">
        <Toggle label="Order Updates" defaultChecked />
        <Toggle label="Promotional Emails" />
      </div>
    </div>
  );
};

// Toggle Switch Component
const Toggle = ({ label, defaultChecked }: { label: string; defaultChecked?: boolean }) => {
  const [enabled, setEnabled] = useState(defaultChecked || false);

  return (
    <label className="flex justify-between items-center bg-gray-800 p-3 rounded-lg cursor-pointer">
      <span className="text-white">{label}</span>
      <input
        type="checkbox"
        checked={enabled}
        onChange={() => setEnabled(!enabled)}
        className="hidden"
      />
      <div
        className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer ${
          enabled ? "bg-blue-600" : "bg-gray-600"
        }`}
        onClick={() => setEnabled(!enabled)}
      >
        <div
          className={`bg-white w-5 h-5 rounded-full shadow-md transform duration-300 ${
            enabled ? "translate-x-6" : ""
          }`}
        ></div>
      </div>
    </label>
  );
};

export default CustomerNotificationSettings;
