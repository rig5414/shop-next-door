"use client";

import { useState } from "react";
import DashboardLayout from "../../../../components/layout/DashboardLayout";
import NotificationSettings from "../../../../components/settings/NotificationSettings";
import SecurityPrivacySettings from "../../../../components/settings/SecurityPrivacySettings";

const VendorSettings = () => {
  return (
    <DashboardLayout role="vendor">
      <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>

      <div className="space-y-8">
        {/* Notification Settings */}
        <section className="bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-white">Notification Settings</h2>
          <NotificationSettings />
        </section>

        {/* Security & Privacy */}
        <section className="bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-white">Security & Privacy</h2>
          <SecurityPrivacySettings />
        </section>
      </div>
    </DashboardLayout>
  );
};

export default VendorSettings;
