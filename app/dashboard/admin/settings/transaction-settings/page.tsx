"use client";
import DashboardLayout from "../../../../../components/layout/DashboardLayout";
import TransactionSettingsForm from "../../../../../components/forms/TransactionSettingsForm";

const TransactionSettingsPage = () => {
  return (
    <DashboardLayout role="admin">
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6">Transaction Settings</h1>
        <p className="text-gray-400 mb-4">
          Configure transaction fees, tax rules, and discount handling.
        </p>

        {/* Transaction Settings Form */}
        <TransactionSettingsForm />
      </div>
    </DashboardLayout>
  );
};

export default TransactionSettingsPage;
