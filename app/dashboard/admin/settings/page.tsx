"use client";
import Link from "next/link";
import DashboardLayout from "../../../../components/layout/DashboardLayout";
import SettingsCard from "../../../../components/settings/SettingsCard";

const settingsSections = [
  {
    title: "Platform Configuration",
    description: "Manage platform-wide settings and toggles.",
    link: "/dashboard/admin/settings/platform-config",
  },
  {
    title: "Transaction Settings",
    description: "View and edit transaction fees and policies.",
    link: "/dashboard/admin/settings/transaction-settings",
  },
  {
    title: "Customization",
    description: "Adjust themes, branding, and layout options.",
    link: "/dashboard/admin/settings/customization",
  },
  {
    title: "Logs & Activity",
    description: "Monitor platform logs and admin activities.",
    link: "/dashboard/admin/settings/logs-activity",
  },
  {
    title: "User Management",
    description: "Manage users, roles, and access levels.",
    link: "/dashboard/admin/settings/user-management",
  },
];

const SettingsPage = () => {
  return (
    <DashboardLayout role ="admin">
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6">Settings</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {settingsSections.map((section, index) => (
            <SettingsCard key={index} {...section} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
