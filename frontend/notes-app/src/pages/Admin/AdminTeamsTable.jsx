import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";

export default function AdminTeamsTable() {
  const [active, setActive] = useState("Main");
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOption, setFilterOption] = useState("Name");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [isBanned, setIsBanned] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [banReason, setBanReason] = useState("");

  // Fetch teams from API
  useEffect(() => {
    fetch("http://localhost:5000/api/teams-admin")
      .then((response) => response.json())
      .then((teams) => {
        const formattedTeams = teams.map((team) => ({
          id: team._id, // Use the actual MongoDB _id
          team: team.name,
          country: "Tunisia",
          hidden: team.isHidden,
          banned: team.isBanned,
        }));
        setData(formattedTeams);
        setFilteredData(formattedTeams);
      })
      .catch((error) => console.error("Error fetching teams:", error));
  }, []);

  // Filter teams based on searchQuery
  useEffect(() => {
    const filtered = data.filter((row) =>
      filterOption === "Id"
        ? row.id.toString().includes(searchQuery)
        : row.team.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchQuery, filterOption, data]);

  // Handle edit button click
  const handleEdit = () => {
    if (selectedRows.length !== 1) {
      console.log("Please select exactly one team to edit.");
      return;
    }

    // Find the team being edited
    const teamToEdit = data.find((team) => team.id === selectedRows[0]);
    if (teamToEdit) {
      setEditingTeam(teamToEdit);
      setIsBanned(teamToEdit.banned);
      setIsHidden(teamToEdit.hidden);
      setBanReason(teamToEdit.banReason || "");
      setIsEditModalOpen(true);
    }
  };

  // Handle edit form submission
  const handleEditSubmit = async () => {
    if (!editingTeam) return;

    try {
      // If isBanned is false, reset banReason to an empty string
      const updatedBanReason = isBanned ? banReason : "";

      const response = await fetch(`http://localhost:5000/api/teams/${editingTeam.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isBanned,
          isHidden,
          banReason: updatedBanReason,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update team");
      }

      const updatedTeam = await response.json();
      console.log("Team updated:", updatedTeam);

      // Update the table data
      const updatedData = data.map((team) =>
        team.id === editingTeam.id
          ? { ...team, banned: isBanned, hidden: isHidden, banReason: updatedBanReason }
          : team
      );
      setData(updatedData);
      setFilteredData(updatedData);

      // Close the modal
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating team:", error);
    }
  };

  // Handle delete functionality
  const handleDelete = async () => {
    if (selectedRows.length === 0) {
      console.log("No teams selected for deletion.");
      return;
    }

    try {
      // Send a DELETE request to the backend
      const response = await fetch("http://localhost:5000/api/teams/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ teamIds: selectedRows }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete teams");
      }

      const data = await response.json();
      console.log("Teams deleted:", data.message);

      // Refetch teams to update the table
      fetch("http://localhost:5000/api/teams-admin")
        .then((response) => response.json())
        .then((teams) => {
          const formattedTeams = teams.map((team) => ({
            id: team._id,
            team: team.name,
            country: "Tunisia",
            hidden: team.isHidden,
            banned: team.isBanned,
          }));
          setData(formattedTeams);
          setFilteredData(formattedTeams);
        })
        .catch((error) => console.error("Error fetching teams after deletion:", error));

      // Clear selected rows
      setSelectedRows([]);
    } catch (error) {
      console.error("Error deleting teams:", error);
    }
  };

  return (
    <div className="flex min-h-screen text-white bg-gray-900">
      <Sidebar active={active} setActive={setActive} />
      <main className="relative flex flex-col items-center justify-center flex-1 gap-8 p-10 ml-64 overflow-hidden">
        <h1 className="mb-4 text-4xl font-extrabold text-center md:text-6xl text-cyan-500 drop-shadow-md">
          TEAMS
        </h1>
        <div></div>
        <div></div>

        {/* Toolbar */}
        <div className="flex items-center justify-between w-full max-w-5xl mb-4">
          {/* Search and Select */}
          <div className="flex flex-row gap-2">
            <select
              className="p-2 w-[120px] bg-gray-800 border border-gray-700 rounded text-gray-300 focus:ring-2 focus:ring-cyan-400"
              value={filterOption}
              onChange={(e) => setFilterOption(e.target.value)}
            >
              <option value="Id">Id</option>
              <option value="Name">Name</option>
            </select>

            <input
              type="text"
              className="p-2 w-[600px] bg-gray-800 border border-gray-700 rounded text-gray-300 focus:ring-2 focus:ring-cyan-400 ml-4"
              placeholder="Search teams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Edit & Delete Buttons */}
          <div className="flex gap-2">
            <button
              className="p-2 text-gray-300 bg-gray-800 rounded hover:bg-gray-700 disabled:opacity-50"
              onClick={handleEdit}
              disabled={selectedRows.length !== 1}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.121-2.121l-6.364 6.364a1.5 1.5 0 00-.394.657l-.894 3.577a.375.375 0 00.46.46l3.577-.894a1.5 1.5 0 00.657-.394l6.364-6.364m-3.536-3.536L9 15.25" />
              </svg>
            </button>
            <button
              className="p-2 text-gray-300 bg-gray-800 rounded hover:bg-gray-700 disabled:opacity-50"
              onClick={handleDelete}
              disabled={selectedRows.length === 0}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142C18.011 20.016 17.123 21 16 21H8c-1.123 0-2.011-.984-2.133-1.858L5 7m5 4v6m4-6v6m1-8V4H9v2m7 0H8m0-2a2 2 0 114 0v2" />
              </svg>
            </button>
          </div>
        </div>

        {isEditModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-lg">
              <h2 className="mb-4 text-xl font-semibold text-gray-200">Edit Team</h2>
              <div className="space-y-4">
                {/* Banned Dropdown */}
                <div>
                  <label className="block mb-1 text-gray-300">Banned</label>
                  <select
                    value={isBanned}
                    onChange={(e) => setIsBanned(e.target.value === "true")}
                    className="w-full p-2 text-gray-300 bg-gray-700 border border-gray-600 rounded"
                  >
                    <option value="false">False</option>
                    <option value="true">True</option>
                  </select>
                </div>
                {/* Hidden Dropdown */}
                <div>
                  <label className="block mb-1 text-gray-300">Hidden</label>
                  <select
                    value={isHidden}
                    onChange={(e) => setIsHidden(e.target.value === "true")}
                    className="w-full p-2 text-gray-300 bg-gray-700 border border-gray-600 rounded"
                  >
                    <option value="false">False</option>
                    <option value="true">True</option>
                  </select>
                </div>
                {/* Ban Reason Input */}
                {isBanned && (
                  <div>
                    <label className="block mb-1 text-gray-300">Ban Reason</label>
                    <input
                      type="text"
                      value={banReason}
                      onChange={(e) => setBanReason(e.target.value)}
                      className="w-full p-2 text-gray-300 bg-gray-700 border border-gray-600 rounded"
                      placeholder="Enter ban reason"
                    />
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  className="px-4 py-2 text-white rounded bg-cyan-500 hover:bg-cyan-600"
                  onClick={handleEditSubmit}
                >
                  Save
                </button>
                <button
                  className="px-4 py-2 text-gray-300 bg-gray-600 rounded hover:bg-gray-700"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="w-full max-w-5xl overflow-x-auto">
          <table className="w-full border border-collapse border-gray-700 table-auto">
            <thead>
              <tr className="text-gray-300 bg-gray-800">
                <th className="w-12 px-2 py-2 text-center border border-gray-700">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedRows(filteredData.map((row) => row.id));
                      } else {
                        setSelectedRows([]);
                      }
                    }}
                    checked={selectedRows.length === filteredData.length}
                  />
                </th>
                <th className="px-4 py-2 text-left border border-gray-700">ID</th>
                <th className="px-4 py-2 text-left border border-gray-700">Team</th>
                <th className="px-4 py-2 text-left border border-gray-700">Country</th>
                <th className="px-4 py-2 text-left border border-gray-700">Hidden</th>
                <th className="px-4 py-2 text-left border border-gray-700">Banned</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, index) => (
                <tr key={row.id} className={`${index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"} text-gray-300 hover:bg-gray-600`}>
                  <td className="w-12 px-2 py-2 text-center border border-gray-700">
                    <input type="checkbox" onChange={() => {
                      setSelectedRows((prevSelectedRows) =>
                        prevSelectedRows.includes(row.id)
                          ? prevSelectedRows.filter((rowId) => rowId !== row.id)
                          : [...prevSelectedRows, row.id]
                      );
                    }} checked={selectedRows.includes(row.id)} />
                  </td>
                  <td className="px-4 py-2 border border-gray-700">{row.id}</td>
                  <td className="px-4 py-2 border border-gray-700">{row.team}</td>
                  <td className="px-4 py-2 border border-gray-700">{row.country}</td>
                  <td className="px-4 py-2 border border-gray-700">
                    {row.hidden ? (
                      <span className="text-xs text-red-500 lowercase">hidden</span>
                    ) : (
                      ""
                    )}
                  </td>
                  <td className="px-4 py-2 border border-gray-700">
                    {row.banned ? (
                      <span className="text-xs text-red-500 lowercase">banned</span>
                    ) : (
                      ""
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}