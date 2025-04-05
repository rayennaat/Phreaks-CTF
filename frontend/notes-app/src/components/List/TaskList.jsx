import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import axios from 'axios';
import { FaPenNib } from 'react-icons/fa'; // Import an icon for the writeup button

const TaskList = ({ teamId }) => {
  const [tasks, setTasks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('0');
  const tasksPerPage = 9; // Number of tasks to display per page
  const navigate = useNavigate(); // Initialize navigation

  console.log('Team ID in TaskList Component:', teamId); // Debugging: Log teamId

  // Fetch solved challenges on component mount
  useEffect(() => {
    if (!teamId) {
      console.log("No Team ID available, skipping fetch");
      return;
    }

    const fetchSolvedChallenges = async () => {
      try {
        console.log("Fetching solved challenges for Team ID:", teamId);
        const response = await axios.get(`http://localhost:5000/team/solved-challenges/${teamId}`);
        console.log("Solved Challenges:", response.data);
        setTasks(response.data); // ✅ Now safely updating state
      } catch (error) {
        console.error("Error fetching solved challenges:", error);
      }
    };

    fetchSolvedChallenges();
  }, [teamId]); // Ensure it runs when `teamId` updates

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setCurrentPage(1); // Reset to the first page when category changes
  };

  const categories = [...new Set(tasks.map((task) => task.category))]; // Get unique categories

  const filteredTasks =
    selectedCategory === '0'
      ? tasks
      : tasks.filter((task) => task.category === selectedCategory);

  // Pagination Logic
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPagination = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex items-center justify-center mt-4 space-x-2">
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => handlePageChange(number)}
            className={`px-3 py-1 border rounded ${
              currentPage === number
                ? 'bg-blue-100 text-blue-600'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {number}
          </button>
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="bg-[#1E1E1E] overflow-y-auto w-full h-[700px] px-12" style={{ WebkitOverflowScrolling: 'touch' }}>
        <br />
        <h1 className="bg-[#1E1E1E] py-3 text-center text-2xl font-mono text-gray-500 uppercase tracking-wide">
          Tasks Solved
        </h1>
        <br />

        <table className="min-w-full divide-y">
          <thead className="bg-transparent text-gray-100 font-medium border border-[#424242]">
            <tr>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase">
                <select
                  id="categorySelect"
                  className="px-6 py-3 text-left text-xs font-medium border-2 border-gray-400 text-gray-500 uppercase tracking-wider bg-[#1E1E1E] rounded-md"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                >
                  <option value="0">All Categories</option>
                  {categories.map((category, index) => (
                    <option key={index + 1} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase">Challenge</th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase">Value</th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase">Date</th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase">Writeup</th> {/* New Column */}
            </tr>
          </thead>
          <tbody className="divide-y">
            {currentTasks.map((task, index) => (
              <tr key={index} className="bg-[#292929] hover:bg-[#424242] border border-[#424242]">
                <td className="px-6 py-4 text-sm text-gray-100 whitespace-nowrap">{task.category}</td>
                <td className="px-6 py-4 text-sm text-gray-100 whitespace-nowrap">{task.title}</td>
                <td className="px-6 py-4 text-sm text-gray-100 whitespace-nowrap">{task.points}</td>
                <td className="px-6 py-4 text-sm text-gray-100 whitespace-nowrap">{new Date(task.time).toLocaleString()}</td>
                {/* Writeup Icon */}
                <td className="px-6 py-4 text-sm text-center text-gray-100 whitespace-nowrap">
                <button
                  onClick={() =>
                    navigate(
                      `/create-writeups?challenge=${encodeURIComponent(task.title)}&category=${encodeURIComponent(task.category)}`
                    )
                  }
                  className="text-gray-400 transition-colors duration-300 hover:text-pink-500"
                  title="Write a Writeup"
                >
                  <FaPenNib size={16} />  
              </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {renderPagination()}
      </div>
    </>
  );
};

export default TaskList;
