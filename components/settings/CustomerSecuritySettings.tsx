"use client";

const CustomerSecuritySettings = () => {
  return (
    <div className="bg-gray-900 p-4 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-white">Security & Privacy</h2>

      <div className="mt-4 space-y-4">
        <button className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded text-white w-full">
          Change Password
        </button>
        <button className="bg-gray-700 hover:bg-gray-800 px-3 py-2 rounded text-white w-full">
          Manage Active Sessions
        </button>
        <button className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded text-white w-full">
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default CustomerSecuritySettings;
