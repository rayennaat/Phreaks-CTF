import React, { useState, useEffect } from 'react';
import UserBar from '../../components/UserBar/UserBar';
import TaskList from '../../components/List/TaskList';
import TeamMemberCard from '../../components/Cards/TeamMemberCard';
import AreaChart from '../../Graphs/Area';
import Chat from '../../components/Chat/Chat';
import axios from 'axios';
import DonutTasksSolved from '../../Graphs/DonutTasksSolved';
import DonutTasksCategory from '../../Graphs/DonutTasksCategory';
import TeamsForm from './TeamsForm'; // Import the TeamsForm component
import TeamRadar from '../../Graphs/TeamRadar';

const Team = () => {
  const [teamDetails, setTeamDetails] = useState({
    name: '',
    points: 0,
    bio: '',
    link: '',
    country: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [teamId, setTeamId] = useState(null);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'settings'

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

        const response = await axios.get('http://localhost:5000/get-team', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            _: Date.now(), // Cache-busting parameter
          },
        });

        if (response.data && response.data.team) {
          setTeamDetails(response.data.team);
          setTeamId(response.data.team.id);
        } else {
          setError('Team data not found.');
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

  // Function to update team details in the parent component
  const handleUpdateTeamDetails = (updatedDetails) => {
    setTeamDetails(updatedDetails);
    setActiveTab('profile'); // Switch back to the profile view after updating
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="bg-[#1E1E1E] dark:bg-[#1E1E1E] min-h-screen pb-1 transition-colors duration-300">
      <UserBar />
      <br /><br /><br />

      {/* Main Team View */}
      <div className="flex flex-col">
        {/* Team Information Section */}
        <div className="flex flex-[1] ml-3 mr-3 border border-[#333] bg-[#212121] rounded-lg shadow-md">
            <div className="flex-[1.5] bg-[#212121]">
              <div className="flex flex-col gap-6 p-6">
              <div className="flex flex-row gap-4 md:gap-8 lg:gap-12">
                <img
                  src={ `http://localhost:5000/${teamDetails.profilePic}` }
                  alt="Team Logo"
                  className="object-cover w-20 h-20 rounded-full"
                />
                <div className="flex flex-col">
                  <h3 className="mb-2 text-lg font-medium text-white">Team:</h3>
                  <h1 className="mb-2 text-2xl font-bold text-white">{teamDetails.name}</h1>
                  <div className="flex items-center">
                    <h3 className="mr-2 text-white">
                      Country: {loading ? 'Loading...' : teamDetails.country || 'Not set'}
                    </h3>
                    {teamDetails.country && (
                      <img
                        src={`https://cdn.jsdelivr.net/npm/react-flagkit@1.0.2/img/SVG/${teamDetails.country}.svg`}
                        alt={`${teamDetails.country} Flag`}
                        style={{ width: '20px', height: '20px' }}
                        onError={(e) => {
                          e.target.src = 'https://example.com/path/to/fallback-flag.svg'; // Fallback image
                        }}
                      />
                    )}
                  </div>
                  <div className="flex flex-row items-center">
                    <h3 className="mr-2 text-white">Score:</h3>
                    <span className="font-medium text-emerald-400">{teamDetails.points}</span>
                  </div>
                </div>
              </div>

                {/* Team Bio Section */}
                <div className="w-[700px] prose text-white dark:prose-white">
                  <h2 className="mb-2 text-xl font-semibold text-white">Team Bio</h2>
                  <p>{teamDetails.bio}</p>
                </div>

                <div className="flex w-[670px] flex-row justify-between">
                  <h3 className="text-base font-medium text-white">Link:</h3>
                  <a href={teamDetails.link} className="text-sky-400 hover:underline">
                    {teamDetails.link}
                  </a>
                </div>
              </div>
            </div>
          </div>

             {/* Toggle Buttons */}
        <div className="flex justify-center gap-4 pt-5 pb-4">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-2 rounded-md font-semibold ${
              activeTab === 'profile' ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-300'
            }`}
          >
            Team View
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-6 py-2 rounded-md font-semibold ${
              activeTab === 'settings' ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-300'
            }`}
          >
            Team Settings
          </button>
        </div>

        {/* Conditional Rendering for Profile or Settings */}
        {activeTab === 'profile' && (
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
              <div className="h-[600px] flex flex-row items-center justify-center w-full gap-10 ">
                <div className="w-[600px] h-[500px] flex items-center justify-center">
                  <TeamRadar teamId={teamId} />
                </div>
                <div className="w-[600px] h-[500px] flex items-center justify-center">
                  <DonutTasksSolved teamId={teamId} />
                </div>
              </div>
              <div className="bg-[#1E1E1E] pb-10 flex justify-center">
                <AreaChart teamId={teamId} />
              </div>
            </div>
          </>
        )}

        {activeTab === 'settings' && (
          <div className="flex justify-center px-10">
            <TeamsForm teamId={teamId} />
          </div>
        )}
      </div>

      {/* Chat Component */}
      <Chat />
    </div>
  );
};

export default Team;