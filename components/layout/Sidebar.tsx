import { Dispatch, SetStateAction, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { FiHome, FiShoppingBag, FiUser, FiSettings, FiMenu, FiLogOut } from "react-icons/fi";
import { FaStore, FaUsers, FaChartBar } from "react-icons/fa";
import { IconType } from "react-icons";
import { motion } from "framer-motion";
import SidebarItem from "./SidebarItem";
import LogoutModal from "../auth/LogOutModal";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: Dispatch<SetStateAction<boolean>>;
  role: "customer" | "vendor" | "admin";
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed, role }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    signOut({ callbackUrl: "/auth/login" }); // Redirect to landing page
  };

  const navItems: Record<
    "customer" | "vendor" | "admin",
    { icon: IconType; text: string; href: string }[]
  > = {
    customer: [
      { icon: FaStore, text: "Shops", href: "/dashboard/customer/shops" },
      { icon: FiShoppingBag, text: "Orders", href: "/dashboard/customer/orders" },
      { icon: FiUser, text: "Profile", href: "/dashboard/profile" },
      { icon: FiSettings, text: "Settings", href: "/dashboard/customer/settings" },
    ],
    vendor: [
      { icon: FaStore, text: "Shop", href: "/dashboard/vendor/shop" },
      { icon: FiShoppingBag, text: "Orders", href: "/dashboard/vendor/orders" },
      { icon: FiUser, text: "Profile", href: "/dashboard/profile" },
      { icon: FiSettings, text: "Settings", href: "/dashboard/vendor/settings" },
    ],
    admin: [
      { icon: FaUsers, text: "Users", href: "/dashboard/admin/users" },
      { icon: FaStore, text: "Vendors", href: "/dashboard/admin/vendors" },
      { icon: FaChartBar, text: "Insights", href: "/dashboard/admin/insights" },
      { icon: FiShoppingBag, text: "Orders", href: "/dashboard/admin/orders" },
      { icon: FiUser, text: "Profile", href: "/dashboard/profile" },
      { icon: FiSettings, text: "Settings", href: "/dashboard/admin/settings" },
    ],
  };

  return (
    <>
      <motion.aside
        animate={{ width: isCollapsed ? "55px" : "220px", opacity: isCollapsed ? 0.9 : 1 }}
        className="fixed top-0 left-0 h-screen bg-gray-900 text-white shadow-lg transition-all flex flex-col"
      >
        {/* Sidebar Header */}
        <div className={`p-3 flex ${isCollapsed ? "justify-center" : "justify-between"} items-center`}>
          {!isCollapsed && <h2 className="text-lg font-bold">Dashboard</h2>}
          <button onClick={() => setIsCollapsed((prev: boolean) => !prev)} className="text-white" aria-label="Toggle Sidebar">
            <FiMenu size={24} />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="mt-4 flex-grow">
          <SidebarItem
            icon={FiHome}
            text="Home"
            href={
              role === "admin" ? "/dashboard/admin" :
              role === "vendor" ? "/dashboard/vendor" :
              "/dashboard/customer"
            }
            isCollapsed={isCollapsed}
            pathname={pathname}
            exactMatch
          />
          {navItems[role].map(({ icon: Icon, text, href }) => (
            <SidebarItem key={href} icon={Icon} text={text} href={href} isCollapsed={isCollapsed} pathname={pathname} />
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-3">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-3 text-red-400 hover:bg-red-600 hover:text-white rounded-md transition-all w-full justify-center"
          >
            <FiLogOut size={24} />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* Logout Confirmation Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
    </>
  );
};

export default Sidebar;
