import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserCards = ({ searchTerm }) => {
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

  const filteredUsers = usersWithTeams.filter(user =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.team?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
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
        {filteredUsers.map((user, index) => (
          <div
            key={index}
            className="bg-[#1f1f1f] dark:bg-[#1f1f1f] rounded-lg shadow-md p-6 border border-neutral-600 dark:border-gray-600 hover:scale-105 transition-transform duration-200"
          >
            <h3 className="mb-2 text-xl font-semibold text-gray-200 dark:text-gray-200">
              {user.fullName}
            </h3>
            <div className="flex flex-col space-y-1">
            <p className="text-blue-500 dark:text-gray-400">
                <span className="font-medium text-gray-300 dark:text-gray-300">site:</span>{' '}
                {user.link}
              </p> 
              <p className="text-gray-400 dark:text-gray-400">
                <span className="font-medium text-gray-300 dark:text-gray-300">Team:</span>{' '}
                {user.team}
              </p>
              <p className="text-gray-400 dark:text-gray-400"><div className="flex flex-row gap-2">
  <span className="font-medium text-gray-300 dark:text-gray-300">Country:</span>
  {user?.country ? (
    <>
      <span>{user.country}</span>
      <img
        src={`https://cdn.jsdelivr.net/npm/react-flagkit@1.0.2/img/SVG/${user.country}.svg`}
        alt={`${user.country} Flag`}
        style={{ width: '20px', height: '20px' }}
        onError={(e) => {
          e.target.src = 'https://example.com/path/to/fallback-flag.svg'; // fallback image
        }}
      />
    </>
  ) : (
    <span className="italic text-gray-400"></span>
  )}
</div>              
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default UserCards;