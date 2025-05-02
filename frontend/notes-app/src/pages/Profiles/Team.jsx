import React, { useState, useEffect } from 'react';
import UserBar from '../../components/UserBar/UserBar';
import TaskList from '../../components/List/TaskList';
import TeamMemberCard from '../../components/Cards/TeamMemberCard';
import AreaChart from '../../Graphs/Area';
import Chat from '../../components/Chat/Chat';
import axios from 'axios';
import DonutTasksSolved from '../../Graphs/DonutTasksSolved';
import DonutTasksCategory from '../../Graphs/DonutTasksCategory';
import TeamsForm from './TeamsForm';
import TeamRadar from '../../Graphs/TeamRadar';

const Team = () => {
  const [teamDetails, setTeamDetails] = useState({
    name: '',
    points: 0,
    bio: '',
    link: '',
    country: '',
    adminId: '',
    profilePic: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [teamId, setTeamId] = useState(null);
  const [currentUserId, setCurrentUserId] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const [isAdmin, setIsAdmin] = useState(false);

  // Fetch team details on component mount
  useEffect(() => {
    const fetchTeamDetails = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          setError('No token found. Please log in.');
          setLoading(false);
          return;
        }

        const response = await axios.get('https://phreaks-ctf.onrender.com/get-team', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data && response.data.team) {
          setTeamDetails(response.data.team);
          setCurrentUserId(response.data.currentUserId);
          setTeamId(response.data.team.id);
          
          // Compare IDs in frontend
          const adminCheck = response.data.currentUserId === response.data.team.adminId;
          setIsAdmin(adminCheck);
          
          console.log("Admin check:", {
            currentUser: response.data.currentUserId,
            adminId: response.data.team.adminId,
            isAdmin: adminCheck
          });
        }
      } catch (err) {
        console.error('Error fetching team data:', err);
        setError('Failed to fetch team data');
      } finally {
        setLoading(false);
      }
    };

    fetchTeamDetails();
  }, []);

  const handleUpdateTeamDetails = (updatedDetails) => {
    setTeamDetails(updatedDetails);
    setActiveTab('profile');
  };

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  if (loading) {
    return <div className="p-4 text-white">Loading team data...</div>;
  }

  return (
    <div className="bg-[#1E1E1E] min-h-screen pb-1">
      <UserBar />
      <div className="px-4 pt-16">
        {/* Team Information Section */}
        <div className="flex flex-col md:flex-row flex-1 mx-3 border border-[#333] bg-[#212121] rounded-lg shadow-md">
          <div className="flex-1 bg-[#212121] p-6">
            <div className="flex flex-col items-center gap-4 sm:flex-row md:gap-8 lg:gap-12">
              <img
                src={`https://phreaks-ctf.onrender.com/${teamDetails.profilePic}`}
                alt="Team Logo"
                className="object-cover w-24 h-24 rounded-full"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/150';
                }}
              />
              <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
                <h1 className="text-2xl font-bold text-white">{teamDetails.name}</h1>
                <div className="flex items-center mt-2">
                  <span className="mr-2 text-gray-300">Country:</span>
                  {teamDetails.country && (
                    <>
                      <span className="mr-2 text-white">{teamDetails.country}</span>
                      <img
                        src={`https://flagcdn.com/24x18/${teamDetails.country.toLowerCase()}.png`}
                        alt="Country flag"
                        className="w-6 h-4"
                      />
                    </>
                  )}
                </div>
                <div className="mt-2">
                  <span className="text-gray-300">Score: </span>
                  <span className="font-bold text-green-400">{teamDetails.points}</span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h2 className="mb-2 text-xl font-semibold text-white">Team Bio</h2>
              <p className="text-gray-300">{teamDetails.bio || 'No bio provided'}</p>
            </div>

            {teamDetails.link && (
              <div className="mt-4">
                <a 
                  href={teamDetails.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  {teamDetails.link}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Toggle Buttons */}
        <div className="flex justify-center gap-4 my-6">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-2 rounded-md font-semibold ${
              activeTab === 'profile' ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-300'
            }`}
          >
            Team View
          </button>
          {isAdmin && (
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-6 py-2 rounded-md font-semibold ${
                activeTab === 'settings' ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-300'
              }`}
            >
              Team Settings
            </button>
          )}
        </div>

        {/* Tab Content */}
        {activeTab === 'profile' ? (
          <>

          {/* Team Members Section */}
          <div className="flex bg-[#212121] justify-center items-center border border-[#333] rounded-lg mt-6">
            <div className="flex-[1] bg-[#212121] px-7">
              <TeamMemberCard teamId={teamId}/>
            </div>
          </div>

          {/* Task List */}
          <div className="flex-1 bg-[#212121] border border-[#333] mt-6">
            <TaskList teamId={teamId} />
          </div>

          {/* Graphs */}
          <div className="flex flex-col">
            {/* Radar + Donut side-by-side on large, stacked on small */}
            <div className="flex flex-col items-center justify-center w-full gap-10 px-4 py-6 lg:flex-row">
              <div className="w-full lg:w-[600px] h-[500px] flex items-center justify-center">
                <TeamRadar teamId={teamId} />
              </div>
              <div className="w-full lg:w-[600px] h-[500px] flex items-center justify-center">
                <DonutTasksSolved teamId={teamId} />
              </div>
            </div>

            {/* Area Chart (bottom) */}
            <div className="bg-[#1E1E1E] px-4 pb-10 flex justify-center">
              <div className="w-full max-w-[1200px]">
                <AreaChart teamId={teamId} />
              </div>
            </div>
          </div>
        </>
        ) : (
          <div className="bg-[#212121] border border-[#333] rounded-lg p-6">
            <TeamsForm teamId={teamId} />
          </div>
        )}
      </div>

    </div>
  );
};

export default Team;