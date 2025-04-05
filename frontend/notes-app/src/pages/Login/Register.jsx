import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { validateEmail } from '../../utils/Helper';
import axiosInstance from '../../utils/axiosInstance';
import Navbar2 from '../../components/Navbar2/Navbar2';
import google from '../../assets/images/search.png';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [teamChoice, setTeamChoice] = useState('join');
  const [teamName, setTeamName] = useState('');
  const [teamPassword, setTeamPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!name) {
        setError('Please enter your name.');
        return;
      }
      if (!validateEmail(email)) {
        setError('Please enter a valid email address.');
        return;
      }
      if (!password) {
        setError('Please enter the password.');
        return;
      }
      setError('');

      const response = await axiosInstance.post('/create-account', {
        fullName: name,
        email: email,
        password: password,
        teamChoice,
        teamName: teamChoice === 'create' ? teamName : undefined,
        teamPassword: teamChoice === 'create' || teamChoice === 'join' ? teamPassword : undefined,
      });

      if (response.data && response.data.error) {
        setError(response.data.message);
        return;
      }
      if (response.data && response.data.accessToken) {
        localStorage.setItem('token', response.data.accessToken);
        navigate('/home');
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar2 />
      <main className="flex flex-col items-center justify-center flex-grow w-full px-4 pt-20 text-gray-100 bg-gray-900">
        <div className="flex-shrink-0 w-full max-w-sm space-y-5 mb-[25px]">
          <div className="pb-8 text-center">
            <div className="mt-8">
              <h3 className="text-2xl font-bold sm:text-3xl">Sign Up</h3>
            </div>
          </div>
          <form onSubmit={handleSignUp} className="space-y-5">
            <div>
              <label className="font-medium">Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 mt-2 text-gray-100 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-1"
              />
            </div>
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
            <div>
              <label className="font-medium">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 mt-2 text-gray-100 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-1"
              />
            </div>
            <div className="mt-5">
              <div className="flex mt-3 space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setTeamChoice('join');
                    setTeamName('');
                    setTeamPassword('');
                  }}
                  className={`w-full px-4 py-2 text-white font-medium rounded-lg duration-150 ${
                    teamChoice === 'join' ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  Join Team
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTeamChoice('create');
                    setTeamName('');
                    setTeamPassword('');
                  }}
                  className={`w-full px-4 py-2 text-white font-medium rounded-lg duration-150 ${
                    teamChoice === 'create' ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  Create Team
                </button>
              </div>
              {teamChoice === 'join' && (
                <div className="mt-5">
                  <label className="font-medium">Enter Team's Password</label>
                  <input
                    type="password"
                    value={teamPassword}
                    onChange={(e) => setTeamPassword(e.target.value)}
                    className="w-full px-3 py-2 mt-2 text-gray-100 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-1"
                  />
                </div>
              )}
              {teamChoice === 'create' && (
                <>
                  <div className="mt-5">
                    <label className="font-medium">Team Name</label>
                    <input
                      type="text"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      className="w-full px-3 py-2 mt-2 text-gray-100 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-1"
                    />
                  </div>
                  <div className="mt-5">
                    <label className="font-medium">Team Password</label>
                    <input
                      type="password"
                      value={teamPassword}
                      onChange={(e) => setTeamPassword(e.target.value)}
                      className="w-full px-3 py-2 mt-2 text-gray-100 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-1"
                    />
                  </div>
                </>
              )}
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full px-4 py-2 font-medium text-white duration-150 rounded-lg hover:bg-indigo-500 active:bg-indigo-700 ${
                isLoading ? 'bg-gray-600' : 'bg-indigo-600'
              }`}
            >
              {isLoading ? 'Creating...' : 'Create an Account'}
            </button>
          </form>
          
          <p className="text-center text-gray-300">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-500">
              Login
            </Link>
          </p>
        </div>
      </main>
    </>
  );
};

export default Register;