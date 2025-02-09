import { useState } from "react";
import Sidebar from "./Sidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

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
