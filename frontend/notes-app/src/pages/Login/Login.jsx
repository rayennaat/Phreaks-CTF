import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import Navbar2 from '../../components/Navbar2/Navbar2';
import google from '../../assets/images/search.png';
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa6";


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false); // New state for password visibility
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
  
    if (!validateEmail(email)) {
        setError('Please enter a valid email address.');
        return;
    }

    if (!password) {
        setError('Please enter the password.');
        return;
    }

    setError('');

    try {
        const response = await axiosInstance.post('/login', { email, password });
        console.log("Login Response:", response.data);

        if (response.data && response.data.accessToken) {
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('isAdmin', response.data.user.isAdmin ? "true" : "false");
            
            console.log("Token stored in localStorage:", localStorage.getItem('accessToken'));
            console.log("Admin status stored in localStorage:", localStorage.getItem('isAdmin'));

            navigate('/home');
        } else {
            console.log("Access token missing in response:", response.data);
        }
    } catch (error) {
        console.error("Login Error:", error);
        setError('Invalid email or password. Please try again.');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <Navbar2 />
      <main className="flex flex-col items-center justify-center w-full h-screen px-4 text-gray-100 bg-gray-900">
        <div className="w-full max-w-sm space-y-5">
          <div className="pb-8 text-center">
            <img
              
            />
            <div className="mt-5">
              <h3 className="text-2xl font-bold sm:text-3xl">Login</h3>
            </div>
          </div>
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="font-medium">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 mt-2 text-gray-100 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-1"
              />
            </div>
            <div className="relative">
              <label className="font-medium">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 mt-2 text-gray-100 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-1"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 mt-7 hover:text-gray-300"
              >
                {showPassword ? (
                  <FaRegEye/> // Eye with slash when password is visible
                ) : (
                  <FaRegEyeSlash/> // Regular eye when password is hidden
                )}
              </button>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-x-3">
                <input
                  type="checkbox"
                  id="remember-me-checkbox"
                  className="w-4 h-4 text-indigo-600 bg-gray-800 border border-gray-700 rounded focus:ring-indigo-600"
                />
                <label htmlFor="remember-me-checkbox" className="text-gray-300 cursor-pointer">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-indigo-400 hover:text-indigo-500">
                Forgot password?
              </a>
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 font-medium text-white duration-150 bg-indigo-600 rounded-lg hover:bg-indigo-500 active:bg-indigo-700"
            >
              Sign in
            </button>
          </form>
          
          <p className="text-center text-gray-300">
            Don't have an account?{' '}
            <Link to="/signup" className="text-indigo-400 hover:text-indigo-500">
              Register
            </Link>
          </p>
        </div>
      </main>
    </>
  );
};

export default Login;