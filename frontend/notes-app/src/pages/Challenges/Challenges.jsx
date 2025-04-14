import React, { useState } from 'react';
import UserBar from "../../components/UserBar/UserBar";
import TaskCard from "../../components/Cards/ScrambleButton";

const ChallengesPage = () => {
  return (
    <div className="min-h-screen pb-1 bg-gradient-to-b from-gray-900 to-black">
      <UserBar />
      <div className="max-w-6xl px-4 pt-32 mx-auto sm:px-6 lg:px-8">
        <h1 className="mb-4 text-6xl font-extrabold text-center text-transparent bg-gradient-to-r from-gray-300 to-white bg-clip-text">
          CHALLENGES
        </h1>
        
        {/* Render TaskCard */}
        <TaskCard />
      </div>
    </div>
  );
};

export default ChallengesPage;