"use client";

import { useState } from "react";

const NotificationSettings = () => {
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    lowStockAlerts: true,
    promotionalEmails: false,
  });

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-4 mt-4">
      {Object.entries(notifications).map(([key, value]) => (
        <div key={key} className="flex justify-between items-center">
          <span className="text-white">{key.replace(/([A-Z])/g, " $1")}</span>
          <button
            onClick={() => toggleNotification(key as keyof typeof notifications)}
            className={`px-4 py-2 rounded-md font-semibold ${
              value ? "bg-green-500 hover:bg-green-600" : "bg-gray-500 hover:bg-gray-600"
            }`}
          >
            {value ? "Enabled" : "Disabled"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationSettings;
