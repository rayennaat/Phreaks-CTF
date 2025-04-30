import React, { useEffect, useState } from "react";
import axios from "axios";

const TabelUsers = ({ searchTerm }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch users with teams from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users-with-teams");
        setUsers(response.data);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user =>
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
    <div className="px-4 mx-auto max-w-screen-3xl md:px-1">
      <div className="mt-12 shadow-sm border border-[#424242] rounded-lg overflow-x-auto">
        <table className="w-full text-sm text-left table-auto">
          <thead className="bg-transparent text-gray-100 font-medium border border-[#424242]">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Website</th>
              <th className="px-6 py-3">Team</th>
              <th className="px-6 py-3">Country</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, idx) => (
                <tr key={idx} className="bg-[#292929] hover:bg-[#424242] border border-[#424242]">
                  <td className="px-6 py-4 text-gray-100 whitespace-nowrap">{user.fullName}</td>
                  <td className="px-6 py-4 text-blue-500 whitespace-nowrap">{' '}{user.link}</td>
                  <td className="px-6 py-4 text-gray-100 whitespace-nowrap">{user.team}</td>
                  <td className="flex flex-row gap-1 px-6 py-4 text-gray-100 whitespace-nowrap">{user?.country ? ( <>
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
                          )}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-400">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TabelUsers;
