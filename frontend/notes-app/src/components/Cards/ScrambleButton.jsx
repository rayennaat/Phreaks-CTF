import React, { useState, useEffect, useRef } from "react";
import { FiLock, FiUnlock, FiFilter, FiX } from "react-icons/fi";
import { motion } from "framer-motion";
import Task from "../Task/Task";
import axios from "axios";

const TaskCard = () => {
  const [challenges, setChallenges] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [teamId, setTeamId] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    categories: [],
    status: 'all' // 'all', 'solved', 'unsolved'
  });

  useEffect(() => {
    const fetchTeamId = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        const response = await axios.get("http://localhost:5000/get-teamid", {
          headers: { Authorization: `Bearer ${token}` },
          params: { _: Date.now() },
        });

        if (response.data?.teamId) {
          setTeamId(response.data.teamId);
        }
      } catch (error) {
        console.error("Error fetching team ID:", error.message);
      }
    };

    fetchTeamId();
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/api/challenges")
      .then((response) => response.json())
      .then((data) => {
        setChallenges(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching challenges:", error);
        setLoading(false);
      });
  }, []);

  // Get all unique categories
  const allCategories = [...new Set(challenges.map(challenge => challenge.category))];

  // Filter challenges based on selected filters
  const filteredChallenges = challenges.filter(challenge => {
    // Category filter
    if (filters.categories.length > 0 && !filters.categories.includes(challenge.category)) {
      return false;
    }
    
    // Status filter
    if (filters.status !== 'all') {
      const isSolved = challenge.solvedByTeams.some(team => team.team_id === teamId);
      if (filters.status === 'solved' && !isSolved) return false;
      if (filters.status === 'unsolved' && isSolved) return false;
    }
    
    return true;
  });

  // Group filtered challenges by category
  const groupedChallenges = filteredChallenges.reduce((groups, challenge) => {
    if (!groups[challenge.category]) groups[challenge.category] = [];
    groups[challenge.category].push(challenge);
    return groups;
  }, {});

  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  const handleClosePopup = () => {
    setSelectedTask(null);
  };

  const toggleCategory = (category) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const toggleStatusFilter = (status) => {
    setFilters(prev => ({
      ...prev,
      status: prev.status === status ? 'all' : status
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      categories: [],
      status: 'all'
    });
  };

  return (
    <div className="relative">
      {/* Filter Controls */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-xl text-gray-300">Filter Challenges</h2>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 text-gray-300 transition-colors bg-gray-800 rounded-md hover:bg-gray-700"
          >
            {showFilters ? <FiX /> : <FiFilter />}
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        {showFilters && (
          <div className="p-4 bg-gray-800 rounded-lg">
            <div className="mb-4">
              <h3 className="mb-2 font-mono text-gray-300">Status</h3>
              <div className="flex gap-2">
                {['solved', 'unsolved'].map(status => (
                  <button
                    key={status}
                    onClick={() => toggleStatusFilter(status)}
                    className={`px-3 py-1 text-sm rounded-full font-mono ${
                      filters.status === status
                        ? 'bg-white text-black'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-2 font-mono text-gray-300">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {allCategories.map(category => (
                  <button
                    key={category}
                    onClick={() => toggleCategory(category)}
                    className={`px-3 py-1 text-sm rounded-full font-mono ${
                      filters.categories.includes(category)
                        ? 'bg-white text-black'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {(filters.categories.length > 0 || filters.status !== 'all') && (
              <button
                onClick={clearAllFilters}
                className="mt-4 text-sm text-gray-400 hover:text-white"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Challenges List */}
      {loading ? (
        <p className="text-center text-gray-300">Loading challenges...</p>
      ) : Object.keys(groupedChallenges).length > 0 ? (
        Object.entries(groupedChallenges).map(([category, challenges]) => (
          <div key={category} className="mb-8">
            <h2 className="mb-4 font-mono text-2xl font-bold text-gray-300">
              {category} Challenges
            </h2>
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {challenges.map((challenge) => {
                const isSolved = challenge.solvedByTeams.some(team => team.team_id === teamId);

                return (
                  <div
                    key={challenge._id}
                    className="rounded-md w-[300px] h-[105px] shadow-md transform transition duration-300 hover:scale-105 cursor-pointer"
                    onClick={() => handleTaskClick(challenge)}
                  >
                    <EncryptButton
                      title={challenge.title}
                      points={`${challenge.points} Points`}
                      isSolved={isSolved}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))
      ) : (
        <div className="p-8 text-center text-gray-400 bg-gray-800 rounded-lg">
          No challenges match your filters. Try adjusting your criteria.
        </div>
      )}

      {/* Task Popup - Now with proper full-screen overlay */}
      {selectedTask && (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-70 p-4">
    <div 
      className="relative w-full max-w-xl p-8 mx-auto text-white bg-gray-900 rounded-lg shadow-2xl"
      style={{
        maxHeight: '90vh',
        overflowY: 'auto'
      }}
    >
      <button
        className="absolute text-xl text-white top-4 right-4 hover:text-gray-300"
        onClick={handleClosePopup}
      >
        ✖
      </button>
      <Task task={selectedTask} onClose={handleClosePopup} />
    </div>
  </div>
)}</div>
  );
};

const CHARS = "!@#$%^&*():{};|,.<>/?";
const CYCLES_PER_LETTER = 2;
const SHUFFLE_TIME = 50;

const EncryptButton = ({ title, points, isSolved }) => {
  const intervalRef = useRef(null);
  const [text, setText] = useState(title);
  const [text2, setText2] = useState(points);

  const scramble = () => {
    let pos = 0;
    intervalRef.current = setInterval(() => {
      const scrambledTitle = title
        .split("")
        .map((char, index) => (pos / CYCLES_PER_LETTER > index ? char : CHARS[Math.floor(Math.random() * CHARS.length)]))
        .join("");

      const scrambledPoints = points
        .split("")
        .map((char, index) => (pos / CYCLES_PER_LETTER > index ? char : CHARS[Math.floor(Math.random() * CHARS.length)]))
        .join("");

      setText(scrambledTitle);
      setText2(scrambledPoints);
      pos++;
      if (pos >= title.length * CYCLES_PER_LETTER) stopScramble();
    }, SHUFFLE_TIME);
  };

  const stopScramble = () => {
    clearInterval(intervalRef.current || undefined);
    setText(title);
    setText2(points);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.025 }}
      whileTap={{ scale: 0.975 }}
      onMouseEnter={scramble}
      onMouseLeave={stopScramble}
      className={`group relative overflow-hidden rounded-lg border w-[300px] h-[105px] flex flex-col justify-center items-center font-mono font-medium uppercase transition-colors ${
        isSolved
          ? "border-green-400 bg-green-600 text-white shadow-lg shadow-green-400/50 hover:bg-green-700 hover:shadow-green-500/50"
          : "border-neutral-600 bg-neutral-800 text-neutral-300 hover:text-indigo-300"
      }`}
    >
      <div className="relative z-10 flex flex-col items-center gap-1">
        <div className="flex items-center gap-2">
          {isSolved ? <FiUnlock /> : <FiLock />}
          <span className={`${isSolved ? "text-white" : ""}`}>{text}</span>
        </div>
        <span className={`text-sm ${isSolved ? "text-white" : "text-neutral-400"}`}>{text2}</span>
      </div>
      <motion.span
        initial={{ y: "100%" }}
        animate={{ y: "-100%" }}
        transition={{ repeat: Infinity, repeatType: "mirror", duration: 1, ease: "linear" }}
        className="duration-300 absolute inset-0 z-0 scale-125 bg-gradient-to-t from-indigo-400/0 from-40% via-indigo-400/100 to-indigo-400/0 to-60% opacity-0 transition-opacity group-hover:opacity-100"
      />
    </motion.button>
  );
};

export default TaskCard;