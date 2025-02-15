"use client";
import { useState } from "react";
import DashboardLayout from "../../../../../components/layout/DashboardLayout";

const mockLogs = [
  { id: 1, action: "User JohnDoe updated transaction settings.", timestamp: "2025-02-15 10:30 AM" },
  { id: 2, action: "Admin JaneSmith deleted user account.", timestamp: "2025-02-14 03:45 PM" },
  { id: 3, action: "System: Weekly data backup completed.", timestamp: "2025-02-13 01:00 AM" },
];

const LogsActivityPage = () => {
  const [logs] = useState(mockLogs);

  return (
    <DashboardLayout role="admin">
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6">Logs & Activity</h1>
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-white mb-4">System Activity Logs</h2>
          <div className="max-h-[500px] overflow-y-auto">
            {logs.length > 0 ? (
              <ul className="space-y-4">
                {logs.map((log) => (
                  <li key={log.id} className="p-4 bg-gray-700 rounded-lg shadow">
                    <p className="text-white">{log.action}</p>
                    <span className="text-gray-400 text-sm">{log.timestamp}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">No activity logs available.</p>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LogsActivityPage;
