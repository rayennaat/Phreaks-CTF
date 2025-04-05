import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import { FaUser } from "react-icons/fa6";
import { FaUserGroup } from "react-icons/fa6";
import { FaTools } from "react-icons/fa";

const UserBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem("isAdmin") === "true");

  useEffect(() => {
    const checkAdminStatus = () => {
      setIsAdmin(localStorage.getItem("isAdmin") === "true");
    };

    window.addEventListener("storage", checkAdminStatus);

    return () => {
      window.removeEventListener("storage", checkAdminStatus);
    };
  }, []);

  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-4">
      {/* Logo */}
      <div className="flex items-center gap-2 space-x-2">
        <a
          href="/home"
          className="flex items-center justify-center w-20 h-6 rounded-full shadow-lg bg-gradient-to-r from-pink-500 to-red-500"
        >
          <span className="text-sm font-bold text-white">CTF.tn</span>
        </a>
        <a href="/writeups"
        className={`text-sm text-white cursor-pointer ${
          location.pathname === "/writeups"
            ? "bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent"
            : "hover:bg-gradient-to-r hover:from-pink-500 hover:to-red-500 hover:bg-clip-text hover:text-transparent"
        }`}
        >
          Writeups
        </a>
      </div>

      {/* Navigation Links */}
      <ul className="flex space-x-8">
        <li>
          <Link
            to="/users"
            className={`text-sm text-white cursor-pointer ${
              location.pathname === "/users"
                ? "bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent"
                : "hover:bg-gradient-to-r hover:from-pink-500 hover:to-red-500 hover:bg-clip-text hover:text-transparent"
            }`}
          >
            Users
          </Link>
        </li>
        <li>
          <Link
            to="/teams"
            className={`text-sm text-white cursor-pointer ${
              location.pathname === "/teams"
                ? "bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent"
                : "hover:bg-gradient-to-r hover:from-pink-500 hover:to-red-500 hover:bg-clip-text hover:text-transparent"
            }`}
          >
            Teams
          </Link>
        </li>
        <li>
          <Link
            to="/scoreboard"
            className={`text-sm text-white cursor-pointer ${
              location.pathname === "/scoreboard"
                ? "bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent"
                : "hover:bg-gradient-to-r hover:from-pink-500 hover:to-red-500 hover:bg-clip-text hover:text-transparent"
            }`}
          >
            Scoreboard
          </Link>
        </li>
        <li>
          <Link
            to="/challenges"
            className={`text-sm text-white cursor-pointer ${
              location.pathname === "/challenges"
                ? "bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent"
                : "hover:bg-gradient-to-r hover:from-pink-500 hover:to-red-500 hover:bg-clip-text hover:text-transparent"
            }`}
          >
            Challenges
          </Link>
        </li>
      </ul>

      {/* Right Side Icons */}
      <div className="flex items-center gap-px space-x-4">
        {isAdmin ? (
          // If admin, show "Admin Panel"
          <Link
            to="/admin/statics"
            className={`group flex flex-row gap-1 items-center text-white cursor-pointer ${
              location.pathname === "/admin/statics"
                ? "hover:text-pink-500 hover:to-red-500"
                : "hover:text-pink-500 hover:to-red-500"
            }`}
          >
            <FaTools
              className={`mr-1 text-sm ${
                location.pathname === "/admin/statics"
                  ? "text-pink-500"
                  : "group-hover:text-pink-500"
              }`}
            />
            <span
              className={`text-sm ${
                location.pathname === "/admin/statics"
                  ? "bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent"
                  : "hover:bg-gradient-to-r hover:from-pink-500 hover:to-red-500 hover:bg-clip-text hover:text-transparent"
              }`}
            >
              Admin Panel
            </span>
          </Link>
        ) : (
          // If normal user, show "Team"
          <Link
            to="/team"
            className={`group flex flex-row items-center text-white cursor-pointer ${
              location.pathname === "/team"
                ? "hover:text-pink-500 hover:to-red-500"
                : "hover:text-pink-500 hover:to-red-500"
            }`}
          >
            <FaUserGroup
              className={`mr-1 text-sm ${
                location.pathname === "/team"
                  ? "text-pink-500"
                  : "group-hover:text-pink-500"
              }`}
            />
            <span
              className={`text-sm ${
                location.pathname === "/team"
                  ? "bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent"
                  : "hover:bg-gradient-to-r hover:from-pink-500 hover:to-red-500 hover:bg-clip-text hover:text-transparent"
              }`}
            >
              Team
            </span>
          </Link>
        )}

        {/* Profile Link */}
        <Link
          to="/profileuser"
          className={`group flex flex-row items-center text-white cursor-pointer ${
            location.pathname === "/profileuser"
              ? "hover:text-pink-500 hover:to-red-500"
              : "hover:text-pink-500 hover:to-red-500"
          }`}
        >
          <FaUser
            className={`mr-1 text-xs ${
              location.pathname === "/profileuser"
                ? "text-pink-500"
                : "group-hover:text-pink-500"
            }`}
          />
          <span
            className={`text-sm ${
              location.pathname === "/profileuser"
                ? "bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent"
                : "hover:bg-gradient-to-r hover:from-pink-500 hover:to-red-500 hover:bg-clip-text hover:text-transparent"
            }`}
          >
            Profile
          </span>
        </Link>

        {/* Logout Button */}
        <Link
          onClick={onLogout}
          to="/login"
          className="flex items-center justify-center text-white rounded-md shadow-lg w-9 h-7 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600"
        >
          <FaSignOutAlt className="text-sm" />
        </Link>
      </div>
    </nav>
  );
};

export default UserBar;