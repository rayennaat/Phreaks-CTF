import { useState, useEffect } from "react";
import { FaChartBar, FaTasks, FaUsers, FaUsersCog, FaListOl, FaFileUpload, FaCogs, FaArrowLeft } from "react-icons/fa";
import { FaPenToSquare } from "react-icons/fa6";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Sidebar({ active, setActive }) {
  const navigate = useNavigate(); // Initialize useNavigate
  const location = useLocation(); // Initialize useLocation to get the current route

  const menuItems = [
    { name: "Statistics", icon: <FaChartBar />, path: "/admin/statics" },
    { name: "Challenges", icon: <FaTasks />, path: "/admin/challenges" },
    { name: "Users", icon: <FaUsers />, path: "/admin/users" },
    { name: "Teams", icon: <FaUsersCog />, path: "/admin/teams" },
    { name: "Scoreboard", icon: <FaListOl />, path: "/admin/scoreboard" },
    { name: "Submissions", icon: <FaFileUpload />, path: "/admin/submissions" },
    { name: "Writeups", icon: <FaPenToSquare  />, path: "/admin/writeups" }, 
    { name: "Config", icon: <FaCogs />, path: "/admin/config" }, 
  ];

  // Update the active state based on the current route
  useEffect(() => {
    const currentMenuItem = menuItems.find((item) => item.path === location.pathname);
    if (currentMenuItem) {
      setActive(currentMenuItem.name);
    }
  }, [location.pathname, setActive, menuItems]);

  const handleMenuItemClick = (item) => {
    setActive(item.name); // Set the active menu item
    navigate(item.path); // Navigate to the corresponding route
  };

  // Function to handle the "Back to Challenges" button click
  const handleBackToChallenges = () => {
    navigate("/challenges");
  };

  return (
    <aside className="fixed flex flex-col w-64 h-full gap-10 p-5 bg-gray-800 border-r border-gray-700 shadow-lg bg-opacity-70 backdrop-blur-lg">
      {/* Admin Dashboard Text (Blue) */}
      <h2 className="mb-5 text-2xl font-bold text-center text-blue-400">
        Admin Dashboard
      </h2>

      {/* Sidebar Menu Items */}
      <ul className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <li
            key={item.name}
            onClick={() => handleMenuItemClick(item)} // Call handleMenuItemClick on click
            className={`flex items-center gap-3 p-3 cursor-pointer rounded-lg transition-all duration-300 
              ${active === item.name ? "bg-blue-500 text-white shadow-lg scale-105" : "hover:bg-gray-700 hover:scale-105"}`}
          >
            {item.icon}
            <span>{item.name}</span>
          </li>
        ))}
      </ul>

      {/* Back to Challenges Button */}
      <button
        onClick={handleBackToChallenges}
        className="flex items-center justify-center gap-2 p-3 text-white transition-all duration-300 rounded-lg shadow-lg bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 hover:scale-105"
      >
        <FaArrowLeft className="text-lg" />
        <span>Back to Challenges</span>
      </button>
    </aside>
  );
}