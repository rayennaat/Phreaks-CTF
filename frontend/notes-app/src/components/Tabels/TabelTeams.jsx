import React, { useEffect, useState } from "react";
import axios from "axios";

const TabelTeams = ({ searchTerm }) => {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch teams from API
    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await axios.get("https://phreaks-ctf.onrender.com/api/teams");
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
        <div className="px-4 mx-auto max-w-screen-3xl md:px-1">
            <div className="mt-12 shadow-sm border border-[#424242] rounded-lg overflow-x-auto">
                <table className="w-full text-sm text-left table-auto">
                    <thead className="bg-transparent text-gray-100 font-medium border border-[#424242]">
                        <tr>
                            <th className="px-6 py-3">Team</th>
                            <th className="px-6 py-3">Website</th>
                            <th className="px-6 py-3">Affiliation</th>
                            <th className="px-6 py-3">Country</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {filteredTeams.length > 0 ? (
                            filteredTeams.map((team) => (
                                <tr
                                    key={team._id}
                                    className="bg-[#292929] hover:bg-[#424242] border border-[#424242]"
                                >
                                    <td className="px-6 py-4 text-gray-100 whitespace-nowrap">
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
                                            <span className="text-blue-500"></span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-gray-300 whitespace-nowrap">
                                        Affiliation
                                    </td>
                                    <td className="flex flex-row gap-1 px-6 py-4 text-gray-300 whitespace-nowrap">
                                    {team?.country ? ( <>
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
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="py-4 text-center text-gray-400">
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
