import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserCards = () => {
  const [usersWithTeams, setUsersWithTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch users with their team names
  useEffect(() => {
    const fetchUsersWithTeams = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users-with-teams');
        setUsersWithTeams(response.data);
      } catch (err) {
        console.error('Error fetching users with teams:', err);
        setError('Failed to fetch users with teams');
      } finally {
        setLoading(false);
      }
    };

    fetchUsersWithTeams();
  }, []);

  if (loading) {
    return <p className="text-center text-white">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <>
      <br />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {usersWithTeams.map((user, index) => (
          <div
            key={index}
            className="bg-[#2A2A2A] dark:bg-[#2A2A2A] rounded-lg shadow-md p-6 border border-neutral-500 dark:border-gray-600 hover:scale-105 transition-transform duration-200"
          >
            <h3 className="mb-2 text-xl font-semibold text-gray-200 dark:text-gray-200">
              {user.fullName}
            </h3>
            <div className="flex flex-col space-y-1">
            <p className="text-blue-500 dark:text-gray-400">
                <span className="font-medium text-gray-300 dark:text-gray-300">site:</span>{' '}
                exempleofsite.com
              </p> 
              <p className="text-gray-400 dark:text-gray-400">
                <span className="font-medium text-gray-300 dark:text-gray-300">Team:</span>{' '}
                {user.team}
              </p>
              <p className="text-gray-400 dark:text-gray-400">
                <span className="font-medium text-gray-300 dark:text-gray-300">Country:</span>{' '}
                Tunisia
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default UserCards;