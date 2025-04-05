import React, { useEffect, useState } from "react";
import axios from "axios";

const TabelUsers = () => {
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

  if (loading) {
    return <p className="text-white text-center">Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  return (
    <div className="max-w-screen-3xl mx-auto px-4 md:px-1">
      <div className="mt-12 shadow-sm border border-[#424242] rounded-lg overflow-x-auto">
        <table className="w-full table-auto text-sm text-left">
          <thead className="bg-transparent text-gray-100 font-medium border border-[#424242]">
            <tr>
              <th className="py-3 px-6">Name</th>
              <th className="py-3 px-6">Website</th>
              <th className="py-3 px-6">Team</th>
              <th className="py-3 px-6">Country</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.length > 0 ? (
              users.map((user, idx) => (
                <tr key={idx} className="bg-[#292929] hover:bg-[#424242] border border-[#424242]">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-100">{user.fullName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-blue-500">example.com</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-100">{user.team}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-100">Tunisia</td>
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
