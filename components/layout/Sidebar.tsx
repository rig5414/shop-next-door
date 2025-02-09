import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { FiHome, FiShoppingBag, FiUser, FiSettings, FiMenu } from "react-icons/fi";
import { FaStore } from "react-icons/fa";
import { motion } from "framer-motion";
import SidebarItem from "./SidebarItem";

// Define the props type
interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [userToggled, setUserToggled] = useState(false); // Track manual toggle
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (!userToggled) {
        // Auto-collapse only if user hasn't manually toggled
        setIsScrolled(window.scrollY > 100);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [userToggled]);

  // Handle manual toggle
  const handleToggle = () => {
    setUserToggled(true); // User manually toggled
    setIsCollapsed((prev) => !prev);
  };

  // Reset user toggle when scrolling up
  useEffect(() => {
    if (!isScrolled) {
      setUserToggled(false); // Allow auto-collapse again when scrolled up
    }
  }, [isScrolled]);

  return (
    <motion.aside
      animate={{
        width: isCollapsed ? "80px" : "250px",
        opacity: isCollapsed ? 0.9 : 1,
      }}
      className={`fixed top-0 left-0 h-screen bg-gray-900 text-white shadow-lg transition-all ${
        isScrolled ? "z-50" : "z-10"
      }`}
    >
      {/* Sidebar Toggle Button */}
      <div className="p-4 flex justify-between items-center">
        <h2 className={`text-lg font-bold ${isCollapsed ? "hidden" : "block"}`}>
          Dashboard
        </h2>
        <button
          onClick={handleToggle}
          className="text-white"
          aria-label="Toggle Sidebar"
        >
          <FiMenu size={24} />
        </button>
      </div>

      {/* Sidebar Links */}
      <nav className="mt-4">
        <SidebarItem icon={FiHome} text="Home" href="/dashboard" isCollapsed={isCollapsed} pathname={pathname} />
        <SidebarItem icon={FaStore} text="Shops" href="/dashboard/shops" isCollapsed={isCollapsed || isScrolled} pathname={pathname} />
        <SidebarItem icon={FiShoppingBag} text="Orders" href="/dashboard/orders" isCollapsed={isCollapsed} pathname={pathname} />
        <SidebarItem icon={FiUser} text="Profile" href="/dashboard/profile" isCollapsed={isCollapsed} pathname={pathname} />
        <SidebarItem icon={FiSettings} text="Settings" href="/dashboard/settings" isCollapsed={isCollapsed} pathname={pathname} />
      </nav>
    </motion.aside>
  );
};

export default Sidebar;
