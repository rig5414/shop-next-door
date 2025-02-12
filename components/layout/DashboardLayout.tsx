import { useState } from "react";
import Sidebar from "./Sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: "customer" | "vendor" | "admin"; // Role prop
}

const DashboardLayout = ({ children, role }: DashboardLayoutProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex">
      {/* Sidebar with role-based navigation */}
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} role={role} />

      {/* Main Content */}
      <main
        className={`flex-1 transition-all duration-300 p-6 ${
          isCollapsed ? "ml-[80px]" : "ml-[250px]"
        }`}
      >
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
