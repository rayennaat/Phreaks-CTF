import React, { useEffect, useState } from "react";
import Blood from "../../assets/images/blood.png";

const TabelScore = () => {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch teams from the API
    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await fetch("https://phreaks-ctf.onrender.com/api/teams-admin");
                if (!response.ok) {
                    throw new Error("Failed to fetch teams");
                }
                const data = await response.json();
                // Sort teams by points in descending order
                const sortedTeams = data.sort((a, b) => b.points - a.points);
                setTeams(sortedTeams);
            } catch (error) {
                console.error("Error fetching teams:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTeams();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="px-4 mx-auto max-w-screen-3xl md:px-1">
            <div className="mt-12 shadow-sm border border-[#424242] rounded-lg overflow-x-auto">
                <table className="w-full text-sm text-left table-auto">
                    <thead className="bg-transparent text-gray-100 font-medium border border-[#424242]">
                        <tr>
                            <th className="px-6 py-3">Rank</th>
                            <th className="px-6 py-3">Team</th>
                            <th className="px-6 py-3 text-center">Website</th>
                            <th className="px-6 py-3 text-center">Points</th>
                            <th className="px-6 py-3 text-right">First Blood</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {teams.map((team, idx) => (
                            <tr
                                key={team._id}
                                className="bg-[#292929] hover:bg-[#424242] border border-[#424242]"
                            >
                                <td className="px-6 py-4 text-gray-100 whitespace-nowrap">
                                    {idx + 1}
                                </td>
                                <td className="px-6 py-4 text-gray-100 whitespace-nowrap">
                                    {team.name}
                                </td>
                                <td className="px-6 py-4 text-center whitespace-nowrap">  {/* Changed for Website */}
                                    <a
                                        href={`https://${team.link}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:underline"
                                    >
                                        {team.link}
                                    </a>
                                </td>
                                <td className="px-6 py-4 text-center text-gray-400 whitespace-nowrap">  {/* Changed for Points */}
                                    {team.points}
                                </td>
                                <td className="py-4 pr-12 text-gray-400 whitespace-nowrap">  {/* Changed for First Blood */}
                                    {team.firstBlood > 0 && (
                                        <div className="flex items-center justify-end gap-1">  {/* Added justify-end */}
                                            <img
                                                src={Blood}
                                                alt="First Blood"
                                                className="w-5 h-6"
                                            />
                                            <span>{team.firstBlood}</span>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TabelScore;