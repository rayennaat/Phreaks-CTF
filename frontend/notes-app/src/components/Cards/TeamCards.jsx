import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TeamCards = ({ searchTerm }) => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch teams from API
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get('https://phreaks-ctf.onrender.com/api/teams');
        setTeams(response.data);
      } catch (err) {
        console.error('Error fetching teams:', err);
        setError('Failed to fetch teams');
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase())
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
        {filteredTeams.length > 0 ? (
          filteredTeams.map((team) => (
            <div
              key={team._id}
              className="bg-[#1f1f1f] dark:bg-[#1f1f1f] rounded-lg shadow-md p-6 border border-neutral-600 dark:border-gray-600 hover:scale-105 transition-transform duration-200"
            >
              <h3 className="mb-2 text-xl font-semibold text-gray-200 dark:text-gray-200">
                {team.name}
              </h3>
              <div className="flex flex-col space-y-1">
                <p className="text-gray-400 dark:text-gray-400">
                  <span className="font-medium text-gray-300 dark:text-gray-300">Site:</span>{' '}
                  <a
                    href={team.link || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline dark:text-blue-400"
                  >
                    {team.link ? team.link : ''}
                  </a>
                </p>
                <p className="text-gray-400 dark:text-gray-400">
                  <span className="font-medium text-gray-300 dark:text-gray-300">Affiliation:</span>{' '}
                  Affiliation
                </p>
                <p className="text-gray-400 dark:text-gray-400"><div className="flex flex-row gap-2">
  <span className="font-medium text-gray-300 dark:text-gray-300">Country:</span>
  {team?.country ? (
    <>
      <span>{team.country}</span>
      <img
        src={`https://cdn.jsdelivr.net/npm/react-flagkit@1.0.2/img/SVG/${team.country}.svg`}
        alt={`${team.country} Flag`}
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
          ))
        ) : (
          <p className="w-full text-center text-gray-400">No teams found</p>
        )}
      </div>
    </>
  );
};

export default TeamCards;
