import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";

export default function AdminScoreboard() {
    const [users, setUsers] = useState([]);
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("teams"); // "teams" or "users"
    const [active, setActive] = useState("Scoreboard");


    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/users");
                const data = await res.json();
                setUsers(data.sort((a, b) => b.points - a.points)); // Sort users by points
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        const fetchTeams = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/teams");
                const data = await res.json();
                setTeams(data.sort((a, b) => b.points - a.points)); // Sort teams by points
            } catch (error) {
                console.error("Error fetching teams:", error);
            }
        };

        Promise.all([fetchUsers(), fetchTeams()]).then(() => setLoading(false));
    }, []);



    return (
        <div className="flex min-h-screen text-white bg-gray-900">
            <Sidebar active={active} setActive={setActive} />
            <main className="relative flex flex-col items-center flex-1 gap-10 p-8 ml-64 overflow-hidden">
                <h1 className="text-4xl font-extrabold text-center md:text-6xl text-cyan-500 drop-shadow-md">
                    SCOREBOARD
                </h1>

                <div className="relative flex flex-col items-center gap-10 w-[1000px] mt-20">
                    {/* Button with an eye icon */}
                    <div className="flex justify-end w-full">
                        <button
                            className="p-2 text-gray-300 bg-gray-800 rounded hover:bg-gray-700"
                            onClick={() => console.log("Eye button clicked")} // Add your logic here
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-10 h-7"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Tabs for switching between Teams and Users */}
                    <div className="flex mt-3 space-x-6 border-b border-gray-700">
                        <button
                            className={`px-4 py-2 text-lg font-semibold ${
                                activeTab === "teams" ? "border-b-2 border-cyan-500 text-cyan-400" : "text-gray-400"
                            }`}
                            onClick={() => setActiveTab("teams")}
                        >
                            Teams
                        </button>
                        <button
                            className={`px-4 py-2 text-lg font-semibold ${
                                activeTab === "users" ? "border-b-2 border-cyan-500 text-cyan-400" : "text-gray-400"
                            }`}
                            onClick={() => setActiveTab("users")}
                        >
                            Users
                        </button>
                    </div>

                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <div className="flex justify-center w-full max-w-5xl">
                            {/* Show only the selected table */}
                            {activeTab === "teams" && (
                                <div className="w-full">
                                    <table className="w-[900px] mx-auto border border-collapse border-gray-700">
                                        <thead>
                                            <tr className="bg-gray-800">
                                                <th className="p-2 border border-gray-700">Place</th>
                                                <th className="p-2 border border-gray-700">Team</th>
                                                <th className="p-2 border border-gray-700">Score</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {teams.map((team, index) => (
                                                <tr key={team._id} className="text-center bg-gray-700">
                                                    
                                                    <td className="p-2 border border-gray-600">{index + 1}</td>
                                                    <td className="p-2 border border-gray-600">
                                                        <a href={team.link} className="text-blue-400 hover:underline">
                                                            {team.name}
                                                        </a>
                                                    </td>
                                                    <td className="p-2 border border-gray-600">{team.points}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {activeTab === "users" && (
                                <div className="w-full">
                                    <table className="w-[900px] mx-auto border border-collapse border-gray-700">
                                        <thead>
                                            <tr className="bg-gray-800">
                                                <th className="p-2 border border-gray-700">Place</th>
                                                <th className="p-2 border border-gray-700">User</th>
                                                <th className="p-2 border border-gray-700">Score</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.map((user, index) => (
                                                <tr key={user._id} className="text-center bg-gray-700">
                                                    <td className="p-2 border border-gray-600">{index + 1}</td>
                                                    <td className="p-2 border border-gray-600">{user.fullName}</td>
                                                    <td className="p-2 border border-gray-600">{user.points}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}