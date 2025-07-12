import { useState, useEffect } from "react";
import { FaBell, FaChartBar, FaTasks, FaUsers, FaUsersCog, FaListOl, FaFileUpload, FaCogs, FaArrowLeft, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FaPenToSquare } from "react-icons/fa6";
import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar({ active, setActive }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: "Statistics", icon: <FaChartBar size={20} />, path: "/admin/statics" },
    { name: "Challenges", icon: <FaTasks size={20} />, path: "/admin/challenges" },
    { name: "Users", icon: <FaUsers size={20} />, path: "/admin/users" },
    { name: "Teams", icon: <FaUsersCog size={20} />, path: "/admin/teams" },
    { name: "Scoreboard", icon: <FaListOl size={20} />, path: "/admin/scoreboard" },
    { name: "Submissions", icon: <FaFileUpload size={20} />, path: "/admin/submissions" },
    { name: "Writeups", icon: <FaPenToSquare size={20} />, path: "/admin/writeups" },
    { name: "Config", icon: <FaCogs size={20} />, path: "/admin/config" },
    { name: "notification", icon: <FaBell size={20} />, path: "/admin/notifications" },
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initialize

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const currentMenuItem = menuItems.find((item) => item.path === location.pathname);
    if (currentMenuItem) {
      setActive(currentMenuItem.name);
    }
  }, [location.pathname, setActive, menuItems]);

  const handleMenuItemClick = (item) => {
    setActive(item.name);
    navigate(item.path);
    if (isMobile) setIsCollapsed(true);
  };

  const handleBackToChallenges = () => {
    navigate("/challenges");
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside className={`fixed flex flex-col h-full bg-gray-800 border-r border-gray-700 shadow-lg bg-opacity-70 backdrop-blur-lg transition-all duration-300 z-50
      ${isCollapsed ? "w-16" : "w-64"}`}
    >
      {/* Toggle Button */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {!isCollapsed && (
          <span className="text-lg font-semibold text-blue-400">Admin</span>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1 text-gray-300 rounded-full hover:bg-gray-700 hover:text-white"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <FaChevronRight size={18} /> : <FaChevronLeft size={18} />}
        </button>
      </div>

      {/* Menu Items */}
      <ul className="flex-1 overflow-y-auto">
        {menuItems.map((item) => (
          <li
            key={item.name}
            onClick={() => handleMenuItemClick(item)}
            className={`flex items-center mx-2 my-1 p-3 rounded-lg cursor-pointer transition-all
              ${active === item.name ? "bg-blue-500 text-white" : "text-gray-300 hover:bg-gray-700"}`}
            title={isCollapsed ? item.name : ""}
          >
            <span className={`flex items-center ${isCollapsed ? "justify-center w-full" : "gap-3"}`}>
              {item.icon}
              {!isCollapsed && <span className="text-sm">{item.name}</span>}
            </span>
          </li>
        ))}
      </ul>

      {/* Back Button */}
      <div className="p-2 border-t border-gray-700">
        <button
          onClick={handleBackToChallenges}
          className={`flex items-center justify-center w-full p-2 text-gray-300 rounded-lg hover:bg-gray-700 transition-all
            ${active === "Back" ? "bg-blue-500 text-white" : ""}`}
          title={isCollapsed ? "Back to Challenges" : ""}
        >
          <FaArrowLeft size={18} />
          {!isCollapsed && <span className="ml-3 text-sm">Back to Challenges</span>}
        </button>
      </div>
    </aside>
  );
}