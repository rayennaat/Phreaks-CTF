import React, { useState } from 'react';
import UserBar from '../../components/UserBar/UserBar';
import SearchTeam from '../../components/UserBar/SearchTeam';
import TeamCards from '../../components/Cards/TeamCards';
import TabelTeams from '../../components/Tabels/TabelTeams';
import { PiCardsThreeLight } from "react-icons/pi";
import { VscTable } from "react-icons/vsc";
import ParticlesBackground from '../../components/Background/ParticlesBackground';

const Teams = () => {
  const [searchTerm, setSearchTerm] = useState("");
 
  const [viewMode, setViewMode] = useState('cards'); // Initial view mode (set to 'cards' for default hover)

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };
  

  return (
    <div className="bg-[#121212] min-h-screen pb-1 transition-colors duration-300"> 
    <ParticlesBackground />
    <UserBar />
    <br /><br /><br /><br /><br /><br />
    <h1 className="relative z-10 mb-4 text-6xl font-extrabold text-center text-transparent bg-gradient-to-r from-gray-300 to-white bg-clip-text">
      TEAMS
    </h1> <br /><br />
    <div className="container p-10 mx-auto">
      <div className="flex mb-6 space-x-4">
        <div>
          <SearchTeam/>
        </div>
        <input
          type="text"
          placeholder="Search for matching teams"
          className="border rounded-sm px-3 py-2 w-3/4 bg-[#1f1f1f] text-white shadow-sm dark:bg-gray-800 border-transparent focus:outline-none focus:ring-1 focus:ring-[#707070] placeholder-zinc-400 font-mono transition duration-200"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="bg-[#1f1f1f] hover:bg-[#1c1c1c] text-white font-bold py-2 px-4 rounded-sm w-1/5">
          Q
        </button>
      </div>
      <div className="flex space-x-2">
              <button
                className={`my-2 
                ${viewMode === 'cards' ? 'bg-[#3f3f3f] ring-2 ring-[#707070] scale-110' : 'bg-[#1f1f1f] hover:bg-[#2f2f2f]'} 
                text-gray-300 transition-all duration-150 ease-in-out rounded border border-[#707070] p-2 w-10`}
                onClick={() => handleViewModeChange('cards')}
              >
                <PiCardsThreeLight className="w-4 h-4 mx-auto" />
              </button>
      
              <button
                className={`my-2 
                ${viewMode === 'table' ? 'bg-[#3f3f3f] ring-2 ring-[#707070] scale-110' : 'bg-[#1f1f1f] hover:bg-[#2f2f2f]'} 
                text-gray-300 transition-all duration-150 ease-in-out rounded border border-[#707070] p-2 w-10`}
                onClick={() => handleViewModeChange('table')}
              >
                <VscTable className="w-4 h-4 mx-auto" />
              </button>
            </div>
      {viewMode === 'cards' && <TeamCards searchTerm={searchTerm} />}
      {viewMode === 'table' && <TabelTeams searchTerm={searchTerm} />}
    </div>
  </div>
);
};

export default Teams; 