import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaUser, FaBars, FaTimes } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";
import { FaTools, FaBell } from "react-icons/fa";
import io from "socket.io-client";

const UserBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem("isAdmin") === "true");
  const [menuOpen, setMenuOpen] = useState(false);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);

  useEffect(() => {
    const checkAdminStatus = () => {
      setIsAdmin(localStorage.getItem("isAdmin") === "true");
    };
    window.addEventListener("storage", checkAdminStatus);
    return () => window.removeEventListener("storage", checkAdminStatus);
  }, []);

  // Socket.io connection for real-time notifications
  useEffect(() => {
    const socket = io('https://phreaks-ctf.onrender.com', {
      transports: ['polling'],
      upgrade: false
    });

    socket.on('new-notification', () => {
      setHasNewNotifications(true);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Reset notification dot when visiting notifications page
  useEffect(() => {
    if (location.pathname === "/notifications") {
      setHasNewNotifications(false);
    }
  }, [location.pathname]);

  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const navLinkStyle = (path) =>
    `relative flex items-center text-sm text-white cursor-pointer after:content-[''] after:absolute after:left-0 after:right-0 after:mx-auto ${
      location.pathname === path ? 'after:w-full' : 'after:w-0'
    } after:h-0.5 after:-bottom-1 after:bg-white after:transition-all after:duration-300 hover:after:w-full`;

  return (
    <nav className="absolute top-0 left-0 right-0 z-10 px-4 py-4 bg-transparent">
      <div className="flex items-center justify-between">
        {/* Left - Logo & Writeups */}
        <div className="flex items-center gap-4">
          <Link
            to="/home"
            className="flex items-center justify-center w-20 h-6 bg-white rounded-full"
          >
            <span className="text-sm font-bold text-black">CTF.tn</span>
          </Link>
          <Link to="/writeups" className={navLinkStyle("/writeups")}>
            Writeups
          </Link>
          <Link to="/notifications" className="relative">
            <FaBell className="text-white text-lg mt-0.5 cursor-pointer hover:text-gray-300" title="Notifications"/>
            {hasNewNotifications && (
              <span className="absolute bottom-0 left-0 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </Link>   
        </div>

        {/* Mobile toggle button */}
        <button 
          onClick={() => setMenuOpen(!menuOpen)} 
          className="text-white lg:hidden"
          aria-label="Toggle menu"
        >
          {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
        </button>

        {/* Desktop nav */}
        <ul className="hidden space-x-8 lg:flex">
          <li><Link to="/users" className={navLinkStyle("/users")}>Users</Link></li>
          <li><Link to="/teams" className={navLinkStyle("/teams")}>Teams</Link></li>
          <li><Link to="/scoreboard" className={navLinkStyle("/scoreboard")}>Scoreboard</Link></li>
          <li><Link to="/challenges" className={navLinkStyle("/challenges")}>Challenges</Link></li>
        </ul>

        {/* Right side icons */}
        <div className="items-center hidden space-x-4 lg:flex">
        {isAdmin ? (
              <Link to="/admin/statics" className={`flex items-center ${navLinkStyle("/admin/statics")}`}>
                <FaTools className="mr-1 text-sm" />
                Admin Panel
              </Link>
            ) : (
              <Link to="/team" className={`flex items-center ${navLinkStyle("/team")}`}>
                <FaUserGroup className="mr-1 text-sm" />
                Team
              </Link>
            )}
            <Link to="/profileuser" className={`flex items-center ${navLinkStyle("/profileuser")}`}>
              <FaUser className="mr-1 text-xs" />
              Profile
            </Link>
          <button
            onClick={onLogout}
            className="flex items-center justify-center text-black bg-white rounded-md w-9 h-7 hover:opacity-80"
          >
            <FaSignOutAlt className="text-sm" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="absolute left-0 right-0 z-20 px-4 py-4 mt-2 bg-gray-900 shadow-lg lg:hidden">
          <ul className="space-y-4">
            <li><Link to="/users" className={navLinkStyle("/users")} onClick={() => setMenuOpen(false)}>Users</Link></li>
            <li><Link to="/teams" className={navLinkStyle("/teams")} onClick={() => setMenuOpen(false)}>Teams</Link></li>
            <li><Link to="/scoreboard" className={navLinkStyle("/scoreboard")} onClick={() => setMenuOpen(false)}>Scoreboard</Link></li>
            <li><Link to="/challenges" className={navLinkStyle("/challenges")} onClick={() => setMenuOpen(false)}>Challenges</Link></li>
          </ul>
          <div className="flex flex-col gap-4 pt-4 mt-6 border-t border-gray-700">
            {isAdmin ? (
              <Link to="/admin/statics" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
                <FaTools className="text-sm" />
                <span className={navLinkStyle("/admin/statics")}>Admin Panel</span>
              </Link>
            ) : (
              <Link to="/team" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
                <FaUserGroup className="text-sm" />
                <span className={navLinkStyle("/team")}>Team</span>
              </Link>
            )}
            <Link to="/profileuser" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
              <FaUser className="text-xs" />
              <span className={navLinkStyle("/profileuser")}>Profile</span>
            </Link>
            <button
              onClick={() => {
                setMenuOpen(false);
                onLogout();
              }}
              className="flex items-center justify-center gap-2 py-2 text-black bg-white rounded-md hover:opacity-80"
            >
              <FaSignOutAlt className="text-sm" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default UserBar;