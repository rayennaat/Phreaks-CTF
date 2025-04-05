import React from 'react';
import { Link } from "react-router-dom";
import phreaks from "../../assets/images/Phreaks.png"

const Navbar2 = () => {

  return (
    <nav
    className={`absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-6 py-4`}
    >
      <div className="flex items-center space-x-2">
        <Link to="/" className="flex items-center">
          <div className="  flex justify-center items-center">
          <img
              src={phreaks}
              width={100}
              className="mx-auto"
              alt="Logo"
            />
          </div>
        </Link>
      </div>
      <ul className="flex space-x-8">
        <li className="text-white hover:text-blue-500 cursor-pointer">Users</li>
        <li className="text-white hover:text-blue-500 cursor-pointer">Teams</li>
        <li className="text-white hover:text-blue-500 cursor-pointer">Ranking</li>
        <li>
                    <Link
                    to="/login"
                    className="text-white hover:text-blue-500 cursor-pointer"
                    >
                    Challenges
                    </Link>
                </li>
      </ul>
      <div className="flex items-center space-x-4">
        <Link to="/login" className="text-white hover:text-blue-500">Log in</Link>
        <Link
          to="/signup"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Register
        </Link>
      </div>
    </nav>
  );
};

export default Navbar2;
