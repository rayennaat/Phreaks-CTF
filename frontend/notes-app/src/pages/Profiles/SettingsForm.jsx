import React, { useState } from 'react';
import axios from 'axios';
import ReactFlagsSelect from 'react-flags-select';

const SettingsForm = ({ userId }) => {
  const [fullName, setFullName] = useState('');
  const [confirmFullName, setConfirmFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [country, setCountry] = useState('');
  const [link, setLink] = useState('');
  const [message, setMessage] = useState('');

  // Handle form submission for country and link (POST)
  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const token = localStorage.getItem('accessToken');
  
      // Create the request body with only the provided fields
      const requestBody = {};
      if (country) requestBody.country = country;
      if (link) requestBody.link = link;
  
      await axios.post(
        `http://localhost:5000/api/users/${userId}/details`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      setMessage('Location and link updated successfully!');
    } catch (error) {
      console.error(error);
      setMessage('An error occurred while updating location and link.');
    }
  };

  // Handle form submission for username, password, and profile picture (PUT)
  const handleAccountSubmit = async (e) => {
    e.preventDefault();
  
    // Validate username and password confirmation
    if (fullName && fullName !== confirmFullName) {
      setMessage('Full name confirmation does not match.');
      return;
    }
    if (password && password !== confirmPassword) {
      setMessage('Password confirmation does not match.');
      return;
    }
  
    try {
      const token = localStorage.getItem('accessToken');
  
      // Create form data for profile picture, username, and password
      const formData = new FormData();
      if (profilePic) formData.append('profilePic', profilePic);
      if (fullName) formData.append('fullName', fullName);
      if (password) formData.append('password', password);
  
      console.log('FormData:', formData); // Debugging: Log FormData
  
      // Update basic info (PUT)
      const response = await axios.post(
        `http://localhost:5000/api/users/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      console.log('Response:', response.data); // Debugging: Log response
  
      setMessage('Account details updated successfully!');
    } catch (error) {
      console.error('Error updating account details:', error);
      setMessage('An error occurred while updating account details.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#1E1E1E]">
      <div className="flex flex-col w-full max-w-6xl gap-6 p-4 md:flex-row">
        {/* Form 1: Country and Link */}
        <div className="bg-[#2E2E2E] h-[400px] p-8 rounded-lg shadow-lg flex-1">
          <h3 className="flex justify-center mb-6 text-xl font-medium text-white">Add Personal Informations</h3>
          <form onSubmit={handleDetailsSubmit} className="space-y-6">
            {/* Country Dropdown with Flags */}
            <div>
              <label className="block mb-2 text-sm font-medium text-white">Country:</label>
              <ReactFlagsSelect
                selected={country}
                onSelect={(code) => setCountry(code)}
                searchable={true}
                placeholder="Select a country"
                className="w-full text-black"
              />
            </div>

            {/* Link */}
            <div>
              <label className="block mb-2 text-sm font-medium text-white">Link:</label>
              <input
                type="text"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="w-full p-2 text-black rounded-md"
              />
            </div>

            {/* Save Changes Button for Location & Link */}
            <div className="flex">
              <button
                type="submit"
                className="px-6 py-2 text-white transition-colors bg-green-600 rounded-md hover:bg-green-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>

        {/* Form 2: Username, Password, and Profile Picture */}
        <div className="bg-[#2E2E2E] p-8 rounded-lg shadow-lg flex-1">
          <h3 className="flex justify-center mb-6 text-xl font-semibold text-white">Update Account Details</h3>
          <form onSubmit={handleAccountSubmit} className="space-y-6">
            {/* Full Name + Confirm */}
            <div>
              <label className="block mb-2 text-sm font-medium text-white">User Name:</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-2 text-black rounded-md"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-white">Confirm User Name:</label>
              <input
                type="text"
                value={confirmFullName}
                onChange={(e) => setConfirmFullName(e.target.value)}
                className="w-full p-2 text-black rounded-md"
              />
            </div>

            {/* Password + Confirm */}
            <div>
              <label className="block mb-2 text-sm font-medium text-white">Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 text-black rounded-md"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-white">Confirm Password:</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2 text-black rounded-md"
              />
            </div>

            {/* Profile Picture */}
            <div>
              <label className="block mb-2 text-sm font-medium text-white">Profile Picture:</label>
              <input
                type="file"
                onChange={(e) => setProfilePic(e.target.files[0])}
                className="w-full p-2 bg-[#3E3E3E] text-white rounded-md"
              />
            </div>

            {/* Save Changes Button for Account Details */}
            <div className="flex">
              <button
                type="submit"
                className="px-6 py-2 text-white transition-colors bg-green-600 rounded-md hover:bg-green-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Global Message */}
      {message && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-[#2E2E2E] p-4 rounded-lg shadow-lg">
          <p className="text-white">{message}</p>
        </div>
      )}
    </div>
  );
};

export default SettingsForm;