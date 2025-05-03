import { useState, useEffect, useRef } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import axios from "axios";
import { FaTrash, FaChevronDown } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminSubmissions() {
    const filterDropdownRef = useRef(null);
    const searchFilterDropdownRef = useRef(null);
    const [submissions, setSubmissions] = useState([]);
    const [filter, setFilter] = useState("All Submissions"); // Filter state
    const [deleteType, setDeleteType] = useState(null); // "single" or "all"
    const [deleteId, setDeleteId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false); // For filter dropdown
    const [isSearchFilterDropdownOpen, setIsSearchFilterDropdownOpen] = useState(false); // For search filter dropdown
    const [searchQuery, setSearchQuery] = useState(""); // For search input
    const [filterOption, setFilterOption] = useState("User"); // For filter dropdown
    const [active, setActive] = useState("Submissions");

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const fetchSubmissions = async () => {
        try {
            const response = await axios.get("https://phreaks-ctf.onrender.com/submissions"); // Correct API URL
            setSubmissions(response.data);
        } catch (error) {
            console.error("Error fetching submissions:", error);
        }
    };

    const handleDeleteClick = (id = null) => {
        setDeleteType(id ? "single" : "all");
        setDeleteId(id);
        setIsModalOpen(true);
    };

    const confirmDelete = async () => {
        try {
            if (deleteType === "single") {
                await axios.delete(`https://phreaks-ctf.onrender.com/submissions/${deleteId}`); // Correct URL
                setSubmissions(submissions.filter(sub => sub._id !== deleteId));
                toast.success("Submission deleted successfully!", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            } else {
                await axios.delete("https://phreaks-ctf.onrender.com/submissions");
                setSubmissions([]);
                toast.success("All submissions deleted successfully!", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            }
        } catch (error) {
            console.error("Error deleting submission(s):", error);
            toast.error("Failed to delete submission(s). Please try again.", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
        setIsModalOpen(false);
    };
    // Filter submissions based on selection
    const filteredSubmissions = submissions.filter((sub) => {
        // Apply type filter
        if (filter !== "All Submissions" && sub.type !== filter) return false;
    
        // Apply search filter
        if (searchQuery.trim() !== "") {
            const searchField =
                filterOption === "User"
                    ? sub.userFullName
                    : filterOption === "Team"
                    ? sub.userTeamName
                    : sub.challengeTitle;
    
            return searchField.toLowerCase().includes(searchQuery.toLowerCase());
        }
    
        return true;
    });
    

    // Custom dropdown options
    const filterOptions = ["All Submissions", "Correct", "Incorrect"];
    const searchFilterOptions = ["User", "Team", "Challenge"];

    // Handle search
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    // Handle filter option change
    const handleFilterOptionChange = (option) => {
        setFilterOption(option);
        setIsSearchFilterDropdownOpen(false); // Close the dropdown after selection
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            // Close filter dropdown if clicked outside
            if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target)) {
                setIsFilterDropdownOpen(false);
            }
            // Close search filter dropdown if clicked outside
            if (searchFilterDropdownRef.current && !searchFilterDropdownRef.current.contains(event.target)) {
                setIsSearchFilterDropdownOpen(false);
            }
        };
    
        // Add event listener
        document.addEventListener("mousedown", handleClickOutside);
    
        // Cleanup
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="flex min-h-screen text-white bg-gray-900">
            <Sidebar active={active} setActive={setActive} />
            <main className="relative flex flex-col items-center flex-1 gap-20 p-8 ml-64 overflow-hidden">
                <h1 className="text-4xl font-extrabold text-center md:text-6xl text-cyan-500 drop-shadow-md">
                    SUBMISSIONS
                </h1>
                <ToastContainer />
                <div className="flex flex-col gap-10">
                    {/* Custom Dropdown for Filter */}
                    <div className="flex justify-end w-full">
                        <div className="relative w-48" ref={filterDropdownRef}>
                            <div
                                className="flex items-center justify-between p-2 text-gray-200 transition-colors duration-200 bg-gray-800 rounded-md cursor-pointer hover:bg-gray-700"
                                onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                            >
                                <span>{filter}</span>
                                <FaChevronDown className={`transform ${isFilterDropdownOpen ? "rotate-180" : ""} transition-transform duration-200`} />
                            </div>
                            {isFilterDropdownOpen && (
                                <div className="absolute z-10 w-full mt-2 bg-gray-800 rounded-md shadow-lg">
                                    {filterOptions.map((option) => (
                                        <div
                                            key={option}
                                            className="p-2 text-gray-200 transition-colors duration-200 cursor-pointer hover:bg-gray-700"
                                            onClick={() => {
                                                setFilter(option);
                                                setIsFilterDropdownOpen(false);
                                            }}
                                        >
                                            {option}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Toolbar */}
                    <div className="flex items-center justify-between w-full max-w-5xl mt-4 mb-4">
                        {/* Search and Filter */}
                        <div className="flex flex-row gap-2">
                            {/* Search Filter Dropdown */}
                            <div className="relative w-[120px] "ref={searchFilterDropdownRef}>
                                <div
                                    className="flex items-center justify-between p-2 text-gray-200 transition-colors duration-200 bg-gray-800 rounded-md cursor-pointer hover:bg-gray-700"
                                    onClick={() => setIsSearchFilterDropdownOpen(!isSearchFilterDropdownOpen)}
                                >
                                    <span>{filterOption}</span>
                                    <FaChevronDown className={`transform ${isSearchFilterDropdownOpen ? "rotate-180" : ""} transition-transform duration-200`} />
                                </div>
                                {isSearchFilterDropdownOpen && (
                                    <div className="absolute z-10 w-full mt-2 bg-gray-800 rounded-md shadow-lg">
                                        {searchFilterOptions.map((option) => (
                                            <div
                                                key={option}
                                                className="p-2 text-gray-200 transition-colors duration-200 cursor-pointer hover:bg-gray-700"
                                                onClick={() => handleFilterOptionChange(option)}
                                            >
                                                {option}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Search Input */}
                            <input
                                type="text"
                                className="p-2 w-[600px] bg-gray-800 border border-gray-700 rounded text-gray-300 focus:ring-2 focus:ring-cyan-400 ml-4"
                                placeholder={`Search by ${filterOption.toLowerCase()}...`}
                                value={searchQuery}
                                onChange={handleSearch}
                            />
                        </div>
                    </div>

                    {/* Submissions Table */}
                    <div className="w-[1055px] mt-4 overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-400">
                            <thead className="text-xs text-gray-300 uppercase bg-gray-800">
                                <tr>
                                    <th className="px-4 py-2">User</th>
                                    <th className="px-4 py-2">Team</th>
                                    <th className="px-4 py-2">Challenge</th>
                                    <th className="px-4 py-2">Type</th>
                                    <th className="px-4 py-2">Flag</th>
                                    <th className="px-4 py-2">Date</th>
                                    <th className="px-4 py-2">Method</th>
                                    <th className="px-4 py-2 text-center">
                                        <FaTrash
                                            className="text-red-500 cursor-pointer hover:text-red-700"
                                            onClick={() => handleDeleteClick()} // Delete all submissions
                                        />
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSubmissions.map((submission) => (
                                    <tr key={submission._id} className="border-b border-gray-700">
                                        <td className="px-4 py-2">{submission.userFullName}</td>
                                        <td className="px-4 py-2">{submission.userTeamName}</td>
                                        <td className="px-4 py-2">{submission.challengeTitle}</td>
                                        <td
                                            className={`px-4 py-2 font-bold ${
                                                submission.type === "Correct" ? "text-green-400" : "text-red-400"
                                            }`}
                                        >
                                            {submission.type}
                                        </td>
                                        <td className="px-4 py-2">{submission.providedFlag}</td>
                                        <td className="px-4 py-2">{new Date(submission.date).toLocaleString()}</td>
                                        <td className="px-4 py-2">{submission.method}</td>
                                        <td className="px-4 py-2 text-center">
                                            <FaTrash
                                                className="text-red-500 cursor-pointer hover:text-red-700"
                                                onClick={() => handleDeleteClick(submission._id)}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Modal for Confirmation */}
                    {isModalOpen && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
                                <p className="text-lg text-gray-200">
                                    {deleteType === "single"
                                        ? "Are you sure you want to delete this submission?"
                                        : "Are you sure you want to delete all submissions?"}
                                </p>
                                <div className="flex justify-end mt-4">
                                    <button
                                        className="px-4 py-2 mr-2 text-white bg-red-600 rounded hover:bg-red-700"
                                        onClick={confirmDelete}
                                    >
                                        Yes
                                    </button>
                                    <button
                                        className="px-4 py-2 text-gray-300 bg-gray-600 rounded hover:bg-gray-700"
                                        onClick={() => setIsModalOpen(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}