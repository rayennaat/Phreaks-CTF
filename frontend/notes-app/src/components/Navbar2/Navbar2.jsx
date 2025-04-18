import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import phreaks from "../../assets/images/Phreaks.png";

const Navbar2 = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinkStyle = "relative text-white cursor-pointer after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:-bottom-1 after:h-0.5 after:w-0 after:bg-white after:transition-all after:duration-300 hover:after:w-full";

  return (
    <nav className="absolute top-0 left-0 right-0 z-10 px-4 py-3 bg-transparent">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <img
              src={phreaks}
              width={100}
              className="mx-auto"
              alt="Logo"
            />
          </Link>
        </div>

        {/* Mobile menu button */}
        <button 
          onClick={() => setMenuOpen(!menuOpen)} 
          className="text-white lg:hidden"
          aria-label="Toggle menu"
        >
          {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
        </button>

        {/* Desktop Navigation */}
        <ul className="hidden space-x-8 text-sm lg:flex">
          {["Users", "Teams", "Scoreboard"].map((item) => (
            <li key={item} className={navLinkStyle}>
              <Link to={`/`}>{item}</Link>
            </li>
          ))}
          <li className={navLinkStyle}>
            <Link to="/login">Challenges</Link>
          </li>
        </ul>

        {/* Desktop Auth Buttons */}
        <div className="items-center hidden space-x-4 text-sm lg:flex">
          <Link to="/login" className={navLinkStyle}>
            Log in
          </Link>
          <Link
            to="/signup"
            className="px-4 py-2 text-white transition-colors duration-300 border border-white rounded-md hover:bg-white hover:text-black"
          >
            Register
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute left-0 right-0 z-20 px-4 py-4 mt-2 space-y-4 bg-gray-900 shadow-lg lg:hidden">
          <ul className="space-y-4">
            {["Users", "Teams", "Scoreboard", "Challenges"].map((item) => (
              <li 
                key={item} 
                className="text-white"
                onClick={() => setMenuOpen(false)}
              >
                <Link to={`/`} className="block py-2">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
          <div className="pt-4 mt-4 space-y-4 border-t border-gray-700">
            <Link
              to="/login"
              className="block py-2 text-white"
              onClick={() => setMenuOpen(false)}
            >
              Log in
            </Link>
            <Link
              to="/signup"
              className="block px-4 py-2 text-center text-white transition-colors duration-300 border border-white rounded-md hover:bg-white hover:text-black"
              onClick={() => setMenuOpen(false)}
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar2;