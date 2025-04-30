import React, { useState } from 'react';
import axios from 'axios';
import ReactFlagsSelect from 'react-flags-select';
import TinyFlag from 'tiny-flag-react'; // Import TinyFlag

const TeamsForm = ({ teamId, onUpdateTeamDetails }) => {
  const [newTeamName, setNewTeamName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [teamProfilePic, setTeamProfilePic] = useState(null);
  const [teamLink, setTeamLink] = useState('');
  const [teamCountry, setTeamCountry] = useState('');
  const [teamBio, setTeamBio] = useState('');
  const [message, setMessage] = useState('');

  // Handle form submission for team details (country, link, bio)
  const handleDetailsSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('accessToken');

      // Create the request body with only the provided fields
      const requestBody = {};
      if (teamCountry) requestBody.country = teamCountry;
      if (teamLink) requestBody.link = teamLink;
      if (teamBio) requestBody.bio = teamBio;

      await axios.post(
        `http://localhost:5000/api/teams/${teamId}/details`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage('Team details updated successfully!');
    } catch (error) {
      console.error(error);
      setMessage('An error occurred while updating team details.');
    }
  };

  // Handle form submission for team name, password, and profile picture (PUT)
  const handleAccountSubmit = async (e) => {
    e.preventDefault();

    // Validate password confirmation
    if (newPassword && newPassword !== confirmPassword) {
      setMessage('Password confirmation does not match.');
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');

      // Create form data for profile picture, team name, and password
      const formData = new FormData();
      if (teamProfilePic) formData.append('TeamPic', teamProfilePic);
      if (newTeamName) formData.append('name', newTeamName);
      if (newPassword) formData.append('password', newPassword);

      console.log('FormData:', formData); // Debugging: Log FormData

      // Update basic info (PUT)
      const response = await axios.post(
        `http://localhost:5000/api/teams/${teamId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('Response:', response.data); // Debugging: Log response

      setMessage('Team account details updated successfully!');
    } catch (error) {
      console.error('Error updating team account details:', error);
      setMessage('An error occurred while updating team account details.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#212121] px-4">
      <div className="flex flex-col w-full max-w-6xl gap-6 p-4 md:flex-row">
        {/* Form 1: Country, Link, and Bio */}
        <div className="bg-[#2E2E2E] h-[470px] p-8 rounded-lg shadow-lg flex-1">
          <h3 className="flex justify-center mb-6 text-xl font-medium text-white">Add Team Informations</h3>
          <form onSubmit={handleDetailsSubmit} className="space-y-6">
            {/* Country Dropdown with Flags */}
            <div>
              <label className="block mb-2 text-sm font-medium text-white">Country:</label>
              <div className="flex items-center gap-2">
                <ReactFlagsSelect
                  selected={teamCountry}
                  onSelect={(code) => {
                    console.log('Selected country code:', code); // Debugging
                    setTeamCountry(code);
                  }}
                  searchable={true}
                  placeholder="Select a country"
                  className="w-full text-black"
                />
                {teamCountry && <TinyFlag country={teamCountry} size="small" />}
              </div>
            </div>

            {/* Link */}
            <div>
              <label className="block mb-2 text-sm font-medium text-white">Link:</label>
              <input
                type="text"
                value={teamLink}
                onChange={(e) => setTeamLink(e.target.value)}
                className="w-full p-2 text-black rounded-md"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block mb-2 text-sm font-medium text-white">Bio:</label>
              <textarea
                value={teamBio}
                onChange={(e) => setTeamBio(e.target.value)}
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

        {/* Form 2: Team Name, Password, and Profile Picture */}
        <div className="bg-[#2E2E2E] p-8 rounded-lg shadow-lg flex-1">
          <h3 className="flex justify-center mb-6 text-xl font-semibold text-white">Update Team Details</h3>
          <form onSubmit={handleAccountSubmit} className="space-y-6">
            {/* Team Name */}
            <div>
              <label className="block mb-2 text-sm font-medium text-white">Team Name:</label>
              <input
                type="text"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                className="w-full p-2 text-black rounded-md"
              />
            </div>

            {/* Password + Confirm */}
            <div>
              <label className="block mb-2 text-sm font-medium text-white">New Password:</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
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
              <label className="block mb-2 text-sm font-medium text-white">Team Picture:</label>
              <input
                type="file"
                onChange={(e) => setTeamProfilePic(e.target.files[0])}
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

export default TeamsForm;