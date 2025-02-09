import Link from "next/link";
import { IconType } from "react-icons";

interface SidebarItemProps {
  icon: IconType;
  text: string;
  href: string;
  isCollapsed: boolean;
  pathname: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, text, href, isCollapsed, pathname }) => {
  return (
    <div className="relative group">
      <Link
        href={href}
        className={`flex items-center gap-3 p-3 rounded-md transition-all ${
          pathname === href ? "bg-blue-600 text-white" : "hover:bg-gray-700 text-gray-300"
        }`}
      >
        <Icon size={24} />
        {!isCollapsed && <span>{text}</span>}
      </Link>

      {/* Tooltip: Show only when sidebar is collapsed */}
      {isCollapsed && (
        <span className="absolute left-full ml-2 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {text}
        </span>
      )}
    </div>
  );
};

export default SidebarItem;
