import React from 'react';
import UserBar from "../../components/UserBar/UserBar";
import TaskCard from "../../components/Cards/ScrambleButton";
import ParticlesBackground from "../../components/Background/ParticlesBackground";

const ChallengesPage = () => {
  return (
    <div className="relative bg-[#f13030] min-h-screen pb-1 overflow-hidden">
      <ParticlesBackground />
      <UserBar />
      <div className="relative z-10 max-w-6xl px-4 pt-32 mx-auto sm:px-6 lg:px-8">
        <h1 className="mb-4 text-6xl font-extrabold text-center text-transparent bg-gradient-to-r from-gray-300 to-white bg-clip-text">
          CHALLENGES
        </h1>
        <TaskCard />
      </div>
    </div>
  );
};

export default ChallengesPage;
