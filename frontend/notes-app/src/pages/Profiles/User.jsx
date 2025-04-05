import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserBar from '../../components/UserBar/UserBar';
import TasksSolved from '../../components/Tabels/TasksSolved';
import DonutChart from '../../Graphs/DonutChart';
import RadarChart from '../../Graphs/UserRadar';
import SettingsForm from './SettingsForm';
import TinyFlag from 'tiny-flag-react'; // Import TinyFlag
import DonutTasksCategory from '../../Graphs/DonutTasksCategory';


const User = () => {
  const [fullName, setFullName] = useState(null);
  const [points, setPoints] = useState(null);
  const [team, setTeam] = useState(null); 
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null); // Add userId state
  const [country, setCountry] = useState(null); // Add country state
  const [profilePic, setProfilePic] = useState(null); // Add profilePic state

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        console.log('Token:', token); // Debugging: Log the token
  
        if (!token) {
          setError('No token found. Please log in.');
          setLoading(false);
          return;
        }
  
        const response = await axios.get('http://localhost:5000/get-user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            _: Date.now(), // Cache-busting parameter
          },
        });
  
        console.log('Response:', response.data); // Debugging: Log the response
  
        if (response.data && response.data.user) {
          setFullName(response.data.user.fullName);
          setPoints(response.data.user.points);
          setTeam(response.data.user.team);
          setUserId(response.data.user.id); // Store userId
          setCountry(response.data.user.country || 'Not set'); // Store country (fallback to 'Not set' if null)
          setProfilePic(response.data.user.profilePic || null); // Store profilePic (fallback to null if not set)
        } else {
          setError('User data not found.');
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserData();
  }, []);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'settings'

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="bg-[#1E1E1E] dark:bg-[#1E1E1E] min-h-screen pb-1 transition-colors duration-300">
      <UserBar />
      <br /><br /><br />
      <div className="flex flex-col">
        <div className="flex justify-between p-10">
          <div className="flex flex-row gap-4">
          <img
              src={`http://localhost:5000/${profilePic}` }
              alt="Profile"
              className="object-cover w-20 h-20 rounded-full"
            />
              <div className="flex flex-col">
              <h3 className="mb-2 text-lg font-medium text-white">
                {loading ? 'Loading...' : fullName || 'User not found'}
              </h3>              
              <div className="flex items-center">
                <h3 className="mr-2 text-white">
                  Country: {loading ? 'Loading...' : country || 'Not set'}
                </h3>
                {country && (
                  <img
                    src={`https://cdn.jsdelivr.net/npm/react-flagkit@1.0.2/img/SVG/${country}.svg`}
                    alt={`${country} Flag`}
                    style={{ width: '20px', height: '20px' }}
                    onError={(e) => {
                      e.target.src = 'https://example.com/path/to/fallback-flag.svg'; // Fallback image
                    }}
                  />
                )}
              </div>
               <h3 className="mr-2 text-white">Score: {loading ? "Loading..." : points || "0"}</h3>
            </div>                                    
          </div>
          <div className="flex flex-col justify-center">
            <h3 className='text-white '>Team :</h3>
            <h1 className="text-green-600">{team}</h1>
          </div>
        </div>

          {/* 2 buttons to change between the profile and the seetings */}
          <div className="flex justify-center gap-4 pb-4">
            <button
              onClick={() => handleTabChange('profile')}
              className={`px-6 py-2 rounded-md font-semibold ${activeTab === 'profile' ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-300'}`}
            >
              Profile
            </button>
            <button
              onClick={() => handleTabChange('settings')}
              className={`px-6 py-2 rounded-md font-semibold ${activeTab === 'settings' ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-300'}`}
            >
              Settings
            </button>
          </div>
          
      {activeTab === 'profile' && (
      <>        
        <div className="px-10 border border-[#333]">
          <TasksSolved userId={userId}/>
          
        </div><br />
        
        <div className="flex flex-col mb-4">
          <div className="flex flex-row items-center justify-center w-full gap-8 ">
            <div className="w-[600px] h-[500px] flex items-center justify-center">
              <DonutTasksCategory userId={userId}/>
            </div>
            <div className="w-[600px] h-[500px] flex items-center justify-center">
              <DonutChart userId={userId}/>
            </div>
          </div> 
          <div className="flex justify-center pt-10">
            {/* <AreaChart />*/}
          </div>
        </div>
        </>
)}
{activeTab === 'settings' && (
  <div className="px-10">
    <SettingsForm userId={userId} />
  </div>
)}
      </div>
    </div>
  );
};

export default User;