import React, { useEffect, useState } from "react";
import axios from "axios";

const TabelTeams = () => {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch teams from API
    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/teams");
                setTeams(response.data);
            } catch (err) {
                console.error("Error fetching teams:", err);
                setError("Failed to fetch teams");
            } finally {
                setLoading(false);
            }
        };

        fetchTeams();
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
                            <th className="py-3 px-6">Team</th>
                            <th className="py-3 px-6">Website</th>
                            <th className="py-3 px-6">Affiliation</th>
                            <th className="py-3 px-6">Country</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {teams.length > 0 ? (
                            teams.map((team) => (
                                <tr
                                    key={team._id}
                                    className="bg-[#292929] hover:bg-[#424242] border border-[#424242]"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-100">
                                        {team.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {team.link ? (
                                            <a
                                                href={team.link.startsWith("http") ? team.link : `https://${team.link}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-500 hover:underline"
                                            >
                                                {team.link}
                                            </a>
                                        ) : (
                                            <span className="text-blue-500">No link available</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                                        Affiliation
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                                        Tunisia
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-gray-400 text-center py-4">
                                    No teams found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TabelTeams;
