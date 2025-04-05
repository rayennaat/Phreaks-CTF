import React, { useEffect, useState } from "react";
import axios from "axios";

const TasksSolved = ({ userId }) => {
  const [solvedChallenges, setSolvedChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch solved challenges for the user
  useEffect(() => {
    const fetchSolvedChallenges = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/challenges/solved-by-user/${userId}`
        );
        setSolvedChallenges(response.data);
      } catch (err) {
        console.error("Error fetching solved challenges:", err);
        setError("Failed to fetch solved challenges");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchSolvedChallenges();
    }
  }, [userId]);

  if (loading) {
    return <p className="text-center text-white">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="px-4 mx-auto max-w-screen-3xl md:px-1">
      <div className="mt-12 overflow-x-auto font-mono border rounded-md shadow-sm border-zinc-600">
        <table className="w-full text-sm text-left table-fixed">
          <thead className="bg-transparent text-gray-100 font-medium border border-[#424242]">
            <tr>
              <th className="w-1/4 px-6 py-3">Challenge</th>
              <th className="w-1/4 px-6 py-3">Category</th>
              <th className="w-1/4 px-6 py-3">Value</th>
              <th className="w-1/4 px-6 py-3">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {solvedChallenges.length > 0 ? (
              solvedChallenges.map((challenge, idx) => (
                <tr
                  key={idx}
                  className="bg-[#292929] hover:bg-[#424242] border border-[#424242]"
                >
                  <td className="px-6 py-4 text-gray-100 whitespace-nowrap">
                    {challenge.title}
                  </td>
                  <td className="px-6 py-4 text-gray-100 whitespace-nowrap">
                    {challenge.category}
                  </td>
                  <td className="px-6 py-4 text-gray-100 whitespace-nowrap">
                    {challenge.points}
                  </td>
                  <td className="px-6 py-4 text-gray-100 whitespace-nowrap">
                    {new Date(challenge.time).toLocaleString()} {/* Format the time */}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="px-6 py-4 text-center text-gray-400"
                >
                  No tasks solved yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TasksSolved;
