"use client";
import DashboardLayout from "../../../../../components/layout/DashboardLayout";
import SettingsUi from "../../../../../components/settings/SettingsUi";

const CustomizationPage = () => {
  return (
    <DashboardLayout role="admin">
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6">Customization</h1>
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-white mb-4">Appearance Settings</h2>
          <SettingsUi />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CustomizationPage;
