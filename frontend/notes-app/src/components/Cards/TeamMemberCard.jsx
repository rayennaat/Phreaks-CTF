import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TeamPage = ({ teamId }) => {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(`https://phreaks-ctf.onrender.com/api/teams/${teamId}/members`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMembers(response.data);
      } catch (error) {
        console.error('Error fetching team members:', error);
      }
    };

    fetchMembers();
  }, [teamId]);

  return (
    <div className="bg-[#212121] dark:bg-gray-900 px-10">
      <div className="container px-10 py-5 mx-auto">
        <h1 className="text-4xl font-semibold text-center text-gray-100 capitalize lg:text-3xl dark:text-white">
          Our Team
        </h1>

        <div className="grid grid-cols-1 gap-8 mt-8 md:grid-cols-2 lg:grid-cols-4">
          {members.length === 0 ? (
            <p className="text-center text-gray-400">No team members found.</p>
          ) : (
            members.map((member) => (
              <div
                key={member._id}
                className="flex flex-col items-center p-8 transition-colors duration-300 transform border cursor-pointer rounded-xl hover:bg-[#374151] dark:hover:bg-[#374151] border-[#374151] dark:border-gray-700"
              >
                <img
                className="object-cover w-32 h-32 rounded-full ring-4 ring-gray-300 dark:ring-gray-600"
                src={ `https://phreaks-ctf.onrender.com/${member.profilePic}`}
                alt={member.fullName}
              />
                <h1 className="mt-4 text-2xl font-semibold text-gray-100 capitalize dark:text-white">
                  {member.fullName}
                </h1>
                <div className="flex items-center pt-3">
                    <h3 className="mr-2 text-white">
                       { member.country || 'Not set'}
                    </h3>
                    {member.country && (
                      <img
                        src={`https://cdn.jsdelivr.net/npm/react-flagkit@1.0.2/img/SVG/${member.country}.svg`}
                        alt={`${member.country} Flag`}
                        style={{ width: '20px', height: '20px' }}
                        onError={(e) => {
                          e.target.src = 'https://example.com/path/to/fallback-flag.svg'; // Fallback image
                        }}
                      />
                    )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamPage;
