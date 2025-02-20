"use client";

import { useState } from "react";
import { Dialog } from "@headlessui/react";

const SecurityPrivacySettings = () => {
  const [twoFA, setTwoFA] = useState(false);
  const [showModal, setShowModal] = useState<"logout" | "export" | "delete" | null>(null);

  return (
    <div className="space-y-4 mt-4">
      {/* Change Password */}
      <div>
        <h3 className="text-white font-semibold">Change Password</h3>
        <button className="mt-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md">
          Change Password
        </button>
      </div>

      {/* Two-Factor Authentication */}
      <div className="flex justify-between items-center">
        <h3 className="text-white font-semibold">Two-Factor Authentication</h3>
        <button
          onClick={() => setTwoFA(!twoFA)}
          className={`px-4 py-2 rounded-md font-semibold ${
            twoFA ? "bg-green-500 hover:bg-green-600" : "bg-gray-500 hover:bg-gray-600"
          }`}
        >
          {twoFA ? "Enabled" : "Disabled"}
        </button>
      </div>

      {/* Active Sessions */}
      <div>
        <h3 className="text-white font-semibold">Active Sessions</h3>
        <button
          onClick={() => setShowModal("logout")}
          className="mt-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
        >
          Logout from other devices
        </button>
      </div>

      {/* Data Export & Account Deletion */}
      <div className="space-y-2">
        <button
          onClick={() => setShowModal("export")}
          className="w-full px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md"
        >
          Export Data
        </button>
        <button
          onClick={() => setShowModal("delete")}
          className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
        >
          Delete Account
        </button>
      </div>

      {/* Confirmation Modals */}
      {showModal && (
        <Dialog open={true} onClose={() => setShowModal(null)} className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold text-white">
              {showModal === "logout"
                ? "Logout from all devices?"
                : showModal === "export"
                ? "Export your data?"
                : "Delete your account?"}
            </h3>
            <p className="text-gray-400 mt-2">
              {showModal === "logout"
                ? "This will log you out from all other devices."
                : showModal === "export"
                ? "A downloadable copy of your data will be generated."
                : "This action is permanent and cannot be undone."}
            </p>

            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={() => setShowModal(null)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  console.log(showModal === "logout" ? "Logging out..." : showModal === "export" ? "Exporting data..." : "Deleting account...");
                  setShowModal(null);
                }}
                className={`px-4 py-2 rounded-md ${
                  showModal === "delete"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-blue-500 hover:bg-blue-600"
                } text-white`}
              >
                {showModal === "logout" ? "Logout" : showModal === "export" ? "Export" : "Delete"}
              </button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
};

export default SecurityPrivacySettings;
