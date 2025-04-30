import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaPenNib } from 'react-icons/fa';

const TaskList = ({ teamId }) => {
  const [tasks, setTasks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('0');
  const tasksPerPage = 9;
  const navigate = useNavigate();

  useEffect(() => {
    if (!teamId) return;

    const fetchSolvedChallenges = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/team/solved-challenges/${teamId}`);
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching solved challenges:", error);
      }
    };

    fetchSolvedChallenges();
  }, [teamId]);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setCurrentPage(1);
  };

  const categories = [...new Set(tasks.map((task) => task.category))];

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
      <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => handlePageChange(number)}
            className={`px-3 py-1 rounded ${
              currentPage === number
                ? 'bg-white text-black'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {number}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-[#1E1E1E] p-4 md:p-8">
      <h1 className="mb-6 font-mono text-xl tracking-wide text-center text-gray-300 uppercase md:text-2xl">
        Tasks Solved
      </h1>

      {/* Category Filter - Mobile First */}
      <div className="mb-6">
        <select
          id="categorySelect"
          className="w-full p-2 text-sm border-2 border-gray-600 text-gray-300 bg-[#292929] rounded-md"
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
      </div>

      {/* Responsive Table Container */}
      <div className="overflow-x-auto">
        {/* Desktop Table (hidden on mobile) */}
        <table className="hidden min-w-full divide-y md:table">
          <thead className="bg-transparent text-gray-100 font-medium border border-[#424242]">
            <tr>
              <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-300 uppercase">
                Category
              </th>
              <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-300 uppercase">
                Challenge
              </th>
              <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-300 uppercase">
                Value
              </th>
              <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-300 uppercase">
                Date
              </th>
              <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-300 uppercase">
                Writeup
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {currentTasks.map((task, index) => (
              <tr key={index} className="bg-[#292929] hover:bg-[#424242] border border-[#424242]">
                <td className="px-4 py-4 text-sm text-gray-300 whitespace-nowrap">
                  {task.category}
                </td>
                <td className="px-4 py-4 text-sm text-gray-300 whitespace-nowrap">
                  {task.title}
                </td>
                <td className="px-4 py-4 text-sm text-gray-300 whitespace-nowrap">
                  {task.points}
                </td>
                <td className="px-4 py-4 text-sm text-gray-300 whitespace-nowrap">
                  {new Date(task.time).toLocaleString()}
                </td>
                <td className="px-4 py-4 text-sm whitespace-nowrap">
                  <div className="flex justify-start ml-5">
                    <button
                      onClick={() =>
                        navigate(
                          `/create-writeups?challenge=${encodeURIComponent(task.title)}&category=${encodeURIComponent(task.category)}`
                        )
                      }
                      title="Write a Writeup"
                      className="text-gray-400 hover:text-pink-500"
                    >
                      <FaPenNib size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile Cards (hidden on desktop) */}
        <div className="space-y-4 md:hidden">
          {currentTasks.map((task, index) => (
            <div key={index} className="bg-[#292929] p-4 rounded-lg border border-[#424242]">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-xs text-gray-400">Category:</div>
                <div className="text-sm text-gray-300">{task.category}</div>
                
                <div className="text-xs text-gray-400">Challenge:</div>
                <div className="text-sm text-gray-300">{task.title}</div>
                
                <div className="text-xs text-gray-400">Value:</div>
                <div className="text-sm text-gray-300">{task.points}</div>
                
                <div className="text-xs text-gray-400">Date:</div>
                <div className="text-sm text-gray-300">{new Date(task.time).toLocaleString()}</div>
              </div>
              
              <div className="flex justify-end mt-3">
                <button
                  onClick={() =>
                    navigate(
                      `/create-writeups?challenge=${encodeURIComponent(task.title)}&category=${encodeURIComponent(task.category)}`
                    )
                  }
                  className="flex items-center text-xs text-pink-500 hover:text-pink-400"
                >
                  <FaPenNib className="mr-1" size={14} />
                  Write Writeup
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {renderPagination()}
    </div>
  );
};

export default TaskList;