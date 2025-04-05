import React from 'react';
import UserBar from "../../components/UserBar/UserBar";
import TaskCard from "../../components/Cards/ScrambleButton";

const ChallengesPage = () => {
  return (
    <div className="bg-gradient-to-b from-gray-900 to-black dark:bg-[#121212] min-h-screen pb-1 transition-colors duration-300">
      <UserBar />
      <br /><br /><br /><br /><br /><br />
      <div className="max-w-6xl px-4 mx-auto sm:px-6 lg:px-8">
        <h1 className="mb-4 text-6xl font-extrabold text-center text-transparent bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text">
          CHALLENGES
        </h1>
        <br /><br />

        {/* Render TaskCard without passing any props */}
        <TaskCard />
      </div>
    </div>
  );
};

export default ChallengesPage;