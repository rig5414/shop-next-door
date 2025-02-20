"use client";

import { useState } from "react";
import DashboardLayout from "../../../../components/layout/DashboardLayout";
import CustomerNotificationSettings from "../../../../components/settings/CustomerNotificationSettings";
import CustomerSecuritySettings from "../../../../components/settings/CustomerSecuritySettings";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState<"notifications" | "security">("notifications");

  return (
    <DashboardLayout role="customer">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white">Settings</h1>

        {/* Tabs Navigation */}
        <div className="flex mt-4 border-b border-gray-700">
          <button
            className={`p-2 px-4 ${activeTab === "notifications" ? "border-b-2 border-blue-500 text-blue-400" : "text-gray-400"}`}
            onClick={() => setActiveTab("notifications")}
          >
            Notifications
          </button>
          <button
            className={`p-2 px-4 ${activeTab === "security" ? "border-b-2 border-blue-500 text-blue-400" : "text-gray-400"}`}
            onClick={() => setActiveTab("security")}
          >
            Security & Privacy
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === "notifications" ? (
            <CustomerNotificationSettings />
          ) : (
            <CustomerSecuritySettings />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
