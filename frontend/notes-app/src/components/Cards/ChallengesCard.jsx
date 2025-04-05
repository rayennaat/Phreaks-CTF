import React, { useState } from "react";
import Task from "../Task/Task";

const ChallengesCard = ({ groupedChallenges }) => {
  const [selectedTask, setSelectedTask] = useState(null);

  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  const handleClosePopup = () => {
    setSelectedTask(null);
  };

  return (
    <>
    
      {Object.entries(groupedChallenges).map(([category, challenges]) => (
        <div key={category} className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            {category}
          </h2>
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {challenges.map((challenge) => (
              <div
                key={challenge.id}
                className={`p-6 border rounded-md w-[300px] h-[105px] shadow-md transform transition duration-300 ${
                  challenge.status === "solved"
                    ? "bg-green-50 border-2 border-green-500 dark:bg-green-900 hover:scale-105 hover:shadow-xl"
                    : "bg-white border-gray-200 dark:bg-gray-800 hover:scale-105 hover:shadow-lg"
                }`}
                onClick={() => handleTaskClick(challenge)}
              >
                <h1 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  {challenge.title}
                </h1>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Points: {challenge.points}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
      <Task task={selectedTask} onClose={handleClosePopup} /> 
    </>
  );
};

export default ChallengesCard;
