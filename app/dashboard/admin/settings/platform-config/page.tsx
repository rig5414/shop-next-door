"use client";
import DashboardLayout from "../../../../../components/layout/DashboardLayout";
import PlatformConfigForm from "../../../../../components/forms/PlatformConfigForm";

const PlatformConfigPage = () => {
  return (
    <DashboardLayout role="admin">
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6">Platform Configuration</h1>
        <PlatformConfigForm />
      </div>
    </DashboardLayout>
  );
};

export default PlatformConfigPage;
