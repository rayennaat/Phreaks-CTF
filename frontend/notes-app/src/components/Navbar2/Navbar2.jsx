import React from 'react';
import { Link } from "react-router-dom";
import phreaks from "../../assets/images/Phreaks.png";

const Navbar2 = () => {
  return (
    <nav className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-3">
      <div className="flex items-center space-x-2">
        <Link to="/" className="flex items-center">
          <div className="flex items-center justify-center">
            <img
              src={phreaks}
              width={100}
              className="mx-auto"
              alt="Logo"
            />
          </div>
        </Link>
      </div>

      <ul className="flex space-x-8 text-sm">
        {["Users", "Teams", "Scoreboard"].map((item) => (
          <li
            key={item}
            className="relative text-white cursor-pointer after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:-bottom-1 after:h-0.5 after:w-0 after:bg-white after:transition-all after:duration-300 hover:after:w-full"
          >
            {item}
          </li>
        ))}
        <li className="relative text-white cursor-pointer after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:-bottom-1 after:h-0.5 after:w-0 after:bg-white after:transition-all after:duration-300 hover:after:w-full">
          <Link to="/login">Challenges</Link>
        </li>
      </ul>

      <div className="flex items-center space-x-4 text-sm">
        <Link
          to="/login"
          className="relative text-white cursor-pointer after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:-bottom-1 om-0 after:h-0.5 after:w-0 after:bg-white after:transition-all after:duration-300 hover:after:w-full"
        >
          Log in
        </Link>

        <Link
          to="/signup"
          className="px-4 py-2 text-white transition-colors duration-300 border border-white rounded-md hover:bg-white hover:text-black"
        >
          Register
        </Link>
      </div>
    </nav>
  );
};

export default Navbar2;
