import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { FiHome, FiShoppingBag, FiUser, FiSettings, FiMenu } from "react-icons/fi";
import { FaStore, FaUsers, FaChartBar, FaCogs } from "react-icons/fa";
import { motion } from "framer-motion";
import SidebarItem from "./SidebarItem";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  role: "customer" | "vendor" | "admin";
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed, role }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [userToggled, setUserToggled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (!userToggled) {
        setIsScrolled(window.scrollY > 100);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [userToggled]);

  const handleToggle = () => {
    setUserToggled(true);
    setIsCollapsed((prev) => !prev);
  };

  useEffect(() => {
    if (!isScrolled) {
      setUserToggled(false);
    }
  }, [isScrolled]);

  return (
    <motion.aside
      animate={{ width: isCollapsed ? "65px" : "220px", opacity: isCollapsed ? 0.9 : 1 }}
      className="fixed top-0 left-0 h-screen bg-gray-900 text-white shadow-lg transition-all"
    >
      {/* Sidebar Header */}
      <div className={`p-3 flex ${isCollapsed ? "justify-center" : "justify-between"} items-center`}>
        {!isCollapsed && <h2 className="text-lg font-bold">Dashboard</h2>}
        <button
          onClick={handleToggle}
          className={`text-white ${isCollapsed ? "flex justify-center w-full" : ""}`}
          aria-label="Toggle Sidebar"
        >
          <FiMenu size={24} />
        </button>
      </div>

      {/* Sidebar Navigation */}
      <nav className={`mt-4 ${isCollapsed ? "flex flex-col items-center space-y-6" : ""}`}>
        <SidebarItem
          icon={FiHome}
          text="Home"
          href={role === "admin" ? "/dashboard/admin" : role === "vendor" ? "/dashboard/vendor" : "/dashboard/customer"}
          isCollapsed={isCollapsed}
          pathname={pathname}
          exactMatch
        />
        {role === "customer" && (
          <>
          <SidebarItem
            icon={FaStore}
            text="Shops"
            href="/dashboard/customer/shops"
            isCollapsed={isCollapsed}
            pathname={pathname}
          />
          <SidebarItem 
            icon={FiShoppingBag} 
            text="Orders" 
            href="/dashboard/customer/orders" 
            isCollapsed={isCollapsed} 
            pathname={pathname} 
          />
          <SidebarItem 
            icon={FiUser} 
            text="Profile" 
            href="/dashboard/customer/profile" 
            isCollapsed={isCollapsed} 
            pathname={pathname} 
          />
          <SidebarItem 
            icon={FiSettings} 
            text="Settings" 
            href="/dashboard/customer/settings" 
            isCollapsed={isCollapsed} 
            pathname={pathname} 
            />
          </>
        )}
        {role === "vendor" && (
          <>
            <SidebarItem
              icon={FaStore}
              text="Shop"
              href="/dashboard/vendor/shop"
              isCollapsed={isCollapsed}
              pathname={pathname}
            />
            <SidebarItem 
              icon={FiShoppingBag} 
              text="Orders" 
              href="/dashboard/vendor/orders" 
              isCollapsed={isCollapsed} 
              pathname={pathname} 
            />
            <SidebarItem 
              icon={FiUser} 
              text="Profile" 
              href="/dashboard/vendor/profile" 
              isCollapsed={isCollapsed} 
              pathname={pathname} 
            />
            <SidebarItem 
              icon={FiSettings} 
              text="Settings" 
              href="/dashboard/vendor/settings" 
              isCollapsed={isCollapsed} 
              pathname={pathname} 
            />
          </>
        )}
        {role === "admin" && (
          <>
            <SidebarItem
              icon={FaUsers}
              text="Users"
              href="/dashboard/admin/users"
              isCollapsed={isCollapsed}
              pathname={pathname}
            />
            <SidebarItem
              icon={FaStore}
              text="Vendors"
              href="/dashboard/admin/vendors"
              isCollapsed={isCollapsed}
              pathname={pathname}
            />
            <SidebarItem
              icon={FaChartBar}
              text="Insights"
              href="/dashboard/admin/insights"
              isCollapsed={isCollapsed}
              pathname={pathname}
            />
            <SidebarItem 
              icon={FiShoppingBag} 
              text="Orders" 
              href="/dashboard/admin/orders" 
              isCollapsed={isCollapsed} 
              pathname={pathname} 
            />
            <SidebarItem 
              icon={FiUser} 
              text="Profile" 
              href="/dashboard/admin/profile" 
              isCollapsed={isCollapsed} 
              pathname={pathname} 
            />
            <SidebarItem 
              icon={FiSettings} 
              text="Settings" 
              href="/dashboard/admmin/settings" 
              isCollapsed={isCollapsed} 
              pathname={pathname} 
            />
          </>
        )}
      </nav>
    </motion.aside>
  );
};

export default Sidebar;
