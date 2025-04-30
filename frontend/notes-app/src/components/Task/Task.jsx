import React, { useState, useEffect } from "react";
import Blood from "../../assets/images/blood.png";
import DOMPurify from "dompurify"; // Import DOMPurify

const Task = ({ task, onClose }) => {
  const [activeTab, setActiveTab] = useState("challenge");
  const [showHint, setShowHint] = useState(false);
  const [solves, setSolves] = useState([]);
  const [flag, setFlag] = useState("");
  const [points, setPoints] = useState(task.points);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!task || !task.solvedByUsers?.length) return;

    const userIds = task.solvedByUsers.map(entry => entry.user_id).join(",");

    fetch(`http://localhost:5000/api/users/solved?userIds=${userIds}`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then(userData => {
        const formattedSolves = task.solvedByUsers.map(entry => ({
          fullName: userData.find(user => user._id === entry.user_id)?.fullName || "Unknown",
          time: new Date(entry.time).toLocaleString(),
        }));
        setSolves(formattedSolves);
      })
      .catch(error => console.error("Error fetching users:", error));
  }, [task]);

  if (!task) return null;

  const handleOutsideClick = (e) => {
    if (e.target.id === "popup-overlay") {
      onClose();
    }
  };

  const handleFlagSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    const token = localStorage.getItem('accessToken');
    console.log('Token:', token); // Debugging: Log the token
    if (!token) {
      setError('No token found. Please log in.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/submit-challenge/${task._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ flag: flag.toLowerCase() }), // Send flag in lowercase for consistent comparison
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit flag");
      }

      const data = await response.json();
      console.log("Flag submission response:", data);

      // Update user and team points
      setPoints(data.pointsAwarded || task.points);

      // Show success message
      setMessage(data.message);

      // Reset flag input
      setFlag("");

      // Refetch solves
      fetchSolves();
    } catch (error) {
      console.error("Error submitting flag:", error);
      setError(error.message);
    }
  };

  const fetchSolves = async () => {
    try {
      const userIds = task.solvedByUsers.map(entry => entry.user_id).join(",");

      const response = await fetch(`http://localhost:5000/api/users/solved?userIds=${userIds}`);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const userData = await response.json();

      const formattedSolves = task.solvedByUsers.map(entry => ({
        fullName: userData.find(user => user._id === entry.user_id)?.fullName || "Unknown",
        time: new Date(entry.time).toLocaleString(),
      }));
      setSolves(formattedSolves);
    } catch (error) {
      console.error("Error fetching solves:", error);
    }
  };

  return (
    <div
      id="popup-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
      onClick={handleOutsideClick}
      
    >
      <div className="bg-slate-950 text-white p-8 rounded-lg shadow-2xl w-[550px] transform transition-transform duration-500 ease-out">
        <button
          className="absolute text-xl text-white top-4 right-4 hover:text-gray-300"
          onClick={onClose}
        >
          ✖
        </button>
        <div className="flex mb-4 border-b border-gray-700">
          <button
            className={`px-4 py-2 font-mono ${
              activeTab === "challenge"
                ? "bg-gray-800 text-white border-b-2 border-white rounded-t-md"
                : "text-gray-400 hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("challenge")}
          >
            CHALLENGE
          </button>
          <button
            className={`px-4 py-2 font-mono ${
              activeTab === "solves"
                ? "bg-gray-800 text-white border-b-2 border-white rounded-t-md"
                : "text-gray-400 hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("solves")}
          >
            SOLVES
          </button>
        </div>
        {/* Conditional Content */}
        {activeTab === "challenge" && (
          <div>
            <h1 className="mb-4 font-mono text-3xl font-bold">
              🕵️‍♂️ {task.title}
            </h1>
            <p className="mb-4 font-mono text-lg font-semibold">
              💰 Points: <span className="text-yellow-400">{points}</span>
            </p>
            <div
              className="pl-4 mb-6 font-mono text-sm text-gray-300 border-l-4 border-gray-500"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(task.description) }} // Render sanitized HTML
            />
            {task.resource && (
              <div className="mt-4">
                <p className="pl-4 mb-2 font-mono text-sm text-gray-300 border-l-4 border-gray-400">
                  Resource:
                </p>
                <a
                  href={`http://localhost:5000${task.resource}`}
                  download
                  className="text-white hover:underline hover:text-gray-300"
                >
                  Download Resource
                </a>
              </div>
            )}
            {!task.resource && (
              <div className="mt-4">
                <p className="pl-4 mb-2 font-mono text-sm text-gray-300 border-l-4 border-gray-400">
                  Resource:
                </p>
                <p className="font-mono text-sm text-gray-300">No Resource Available</p>
              </div>
            )}
            {task.hint && (
              <div>
                <button
                  className="px-6 py-2 mt-2 font-mono text-white bg-gray-800 border border-gray-500 rounded-md shadow-md hover:bg-gray-700"
                  onClick={() => setShowHint(!showHint)}
                >
                  {showHint ? "Hide Hint" : "Hint"}
                </button>
                {showHint && (
                  <p className="py-1 pl-4 mt-4 font-mono text-sm text-gray-300 bg-gray-800 border-l-4 rounded-md">
                    {task.hint}
                  </p>
                )}
              </div>
            )}
            <form onSubmit={handleFlagSubmit} className="mt-6">
              <input
                type="text"
                placeholder="Enter your flag here..."
                className="w-full px-4 py-2 font-mono text-white bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                value={flag}
                onChange={(e) => setFlag(e.target.value)}
                required
              />
              <button
                type="submit"
                className="px-6 py-2 mt-6 font-mono font-bold text-white transition-transform duration-300 bg-gray-700 rounded-md shadow-lg hover:bg-gray-600 hover:scale-105"
              >
                Submit Flag
              </button>
            </form>
            {message && (
              <div className="p-4 mt-4 text-white bg-gray-700 rounded-lg">{message}</div>
            )}
            {error && (
              <div className="p-4 mt-4 text-white bg-red-600 rounded-lg">{error}</div>
            )}
          </div>
        )}
        {activeTab === "solves" && (
          <div className="p-4">
            {solves.length > 0 ? (
              <table className="min-w-full font-mono text-gray-300 divide-y divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase">User</th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase">Time</th>
                  </tr>
                </thead>
                <tbody className="bg-transparent divide-y divide-gray-800">
                  {solves.map((solve, index) => (
                    <tr key={index}>
                      <td className="flex items-center px-6 py-4 whitespace-nowrap">
                        {solve.fullName}
                        {index === 0 && <img src={Blood} alt="First Blood" className="w-5 h-6 ml-2" />}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{solve.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="font-mono text-center text-gray-300">No one solved it yet!</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Task;