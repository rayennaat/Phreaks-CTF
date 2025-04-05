import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import styles
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DOMPurify from "dompurify";

export default function AdminChallenges() {
  const [active, setActive] = useState("Main");
  const [showCreateForm, setShowCreateForm] = useState(false); // Toggle create form
  const [challenges, setChallenges] = useState([]); // Store challenges
  const [selectedRows, setSelectedRows] = useState([]); // Selected challenges for deletion
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOption, setFilterOption] = useState("Title");
  const [filteredData, setFilteredData] = useState([]); // Store filtered challenges
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [pointsMethod, setPointsMethod] = useState("Standard"); // Default to Standard
  const [points, setPoints] = useState("");
  const [initialValue, setInitialValue] = useState("");
  const [decayValue, setDecayValue] = useState("");
  const [minimumValue, setMinimumValue] = useState("");
  const [description, setDescription] = useState("");
  const [hint, setHint] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null); // Store any errors
  const [flag, setFlag] = useState(""); // Add flag state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Confirmation popup state
  const [isEditFormOpen, setIsEditFormOpen] = useState(false); // Toggle edit form
  const [editingChallenge, setEditingChallenge] = useState(null); // Store the challenge being edited

  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"], // Text styling
      [{ header: 1 }, { header: 2 }], // Headings
      [{ list: "ordered" }, { list: "bullet" }], // Lists
      ["blockquote", "code-block"], // Block elements
      [{ align: [] }], // Text alignment
      ["clean"], // Remove formatting
    ],
  };

  // Fetch challenges from API
  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/challenges"); // Use the correct endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const challenges = await response.json(); // Parse the response as JSON
        console.log("Fetched challenges:", challenges); // Log the fetched data
        // Format the challenges to match the table structure
        const formattedChallenges = challenges.map((challenge) => ({
          id: challenge._id, // Use _id as id
          title: challenge.title,
          category: challenge.category,
          points: challenge.points,
          description: challenge.description,
          hint: challenge.hint,
          resource: challenge.resource,
        }));
        setChallenges(formattedChallenges); // Store the formatted challenges
        setFilteredData(formattedChallenges); // Initially, filtered data is the same
      } catch (error) {
        console.error("Error fetching challenges:", error);
      }
    };
    fetchChallenges();
  }, []);

  // Filter challenges based on searchQuery
  useEffect(() => {
    const filtered = challenges.filter((row) => {
      if (filterOption === "Id") {
        return row.id.toString().includes(searchQuery);
      } else if (filterOption === "Title") {
        return row.title.toLowerCase().includes(searchQuery.toLowerCase());
      } else if (filterOption === "Category") {
        return row.category.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return true; // Default case, return all challenges
    });

    setFilteredData(filtered);
  }, [searchQuery, filterOption, challenges]);

  // Handle form submission
  const handleCreateChallenge = async (e) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("description", DOMPurify.sanitize(description)); // Sanitize HTML
    formData.append("flag", flag);
    formData.append("pointsMethod", pointsMethod);
    if (hint) formData.append("hint", hint);
    if (file) formData.append("resource", file);

    if (pointsMethod === "Standard") {
      formData.append("points", Number(points));
    } else if (pointsMethod === "Linear" || pointsMethod === "Logarithmic") {
      formData.append("initialValue", Number(initialValue));
      formData.append("decayValue", Number(decayValue));
      formData.append("minimumValue", Number(minimumValue));
    }

    try {
      const response = await fetch("http://localhost:5000/add-challenge", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create challenge");
      }

      const data = await response.json();
      console.log("Challenge created:", data.challenge);

      // Show success toast
      toast.success("Task created successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Reset form fields
      setTitle("");
      setCategory("");
      setPointsMethod("Standard");
      setPoints("");
      setInitialValue("");
      setDecayValue("");
      setMinimumValue("");
      setDescription("");
      setHint("");
      setFile(null);
      setFlag("");

      // Hide the form after submission
      setShowCreateForm(false);

      // Refetch challenges to update the table
      fetchChallenges();
    } catch (error) {
      console.error("Error creating challenge:", error);
      setError(error.message);

      // Show error toast
      toast.error(`Error: ${error.message}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  // Fetch challenges from API
  const fetchChallenges = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/challenges"); // Use the correct endpoint
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const challenges = await response.json(); // Parse the response as JSON
      console.log("Fetched challenges:", challenges); // Log the fetched data
      // Format the challenges to match the table structure
      const formattedChallenges = challenges.map((challenge) => ({
        id: challenge._id, // Use _id as id
        title: challenge.title,
        category: challenge.category,
        points: challenge.points,
        description: challenge.description,
        hint: challenge.hint,
        resource: challenge.resource,
      }));
      setChallenges(formattedChallenges); // Store the formatted challenges
      setFilteredData(formattedChallenges); // Initially, filtered data is the same
    } catch (error) {
      console.error("Error fetching challenges:", error);
    }
  };

// Handle delete button click
const handleDelete = () => {
  if (selectedRows.length === 0) {
    toast.error("No challenges selected for deletion.");
    return;
  }
  setIsDeleteModalOpen(true); // Open confirmation popup
};

// Handle confirmation of deletion
const confirmDelete = async () => {
  setIsDeleteModalOpen(false); // Close the confirmation popup

  try {
    let response;
    if (selectedRows.length === challenges.length) {
      // Delete all challenges
      response = await fetch("http://localhost:5000/api/all-challenges", {
        method: "DELETE",
      });
    } else {
      // Delete specific challenges
      response = await fetch("http://localhost:5000/api/delete-challenges", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ challengeIds: selectedRows }), // Ensure this matches the backend
      });
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to delete challenges");
    }

    const data = await response.json();
    console.log("Challenges deleted:", data.message);

    // Show success toast
    toast.success("Challenges deleted successfully!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });

    // Refetch challenges to update the table
    fetchChallenges();

    // Clear selected rows
    setSelectedRows([]);
  } catch (error) {
    console.error("Error deleting challenges:", error);
    toast.error(`Error: ${error.message}`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }
};
const handleEdit = async (id) => {
  console.log("Editing challenge with ID:", id); // Log the ID
  try {
    const cleanedId = String(id).trim(); // Convert `id` to a string and trim it
    const response = await fetch(`http://localhost:5000/api/challenges/${cleanedId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const challenge = await response.json();
    setEditingChallenge(challenge);
    setIsEditFormOpen(true);

    // Pre-fill the form fields
    setTitle(challenge.title);
    setCategory(challenge.category);
    setPointsMethod(challenge.pointsMethod || "Standard");
    setPoints(challenge.points);
    setInitialValue(challenge.initialValue || "");
    setDecayValue(challenge.decayValue || "");
    setMinimumValue(challenge.minimumValue || "");
    setDescription(challenge.description);
    setHint(challenge.hint || "");
    setFlag(challenge.flag);
  } catch (error) {
    console.error("Error fetching challenge for editing:", error);
    toast.error("Failed to fetch challenge data for editing.", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }
};

const handleEditChallenge = async (e) => {
  e.preventDefault();
  setError(null);

  const formData = new FormData();
  formData.append("title", title);
  formData.append("category", category);
  formData.append("description", DOMPurify.sanitize(description));
  formData.append("flag", flag);
  formData.append("pointsMethod", pointsMethod);
  if (hint) formData.append("hint", hint);
  if (file) formData.append("resource", file); // Append the file if it exists

  if (pointsMethod === "Standard") {
    formData.append("points", Number(points));
  } else if (pointsMethod === "Linear" || pointsMethod === "Logarithmic") {
    formData.append("initialValue", Number(initialValue));
    formData.append("decayValue", Number(decayValue));
    formData.append("minimumValue", Number(minimumValue));
  }

  try {
    console.log("Sending form data:", Object.fromEntries(formData)); // Log the form data

    const response = await fetch(`http://localhost:5000/api/challenges/${editingChallenge._id}`, {
      method: "PUT",
      body: formData, // Send FormData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to update challenge");
    }

    const data = await response.json();
    console.log("Challenge updated:", data); // Log the updated challenge

    // Show success toast
    toast.success("Challenge updated successfully!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });

    // Reset form fields
    setTitle("");
    setCategory("");
    setPointsMethod("Standard");
    setPoints("");
    setInitialValue("");
    setDecayValue("");
    setMinimumValue("");
    setDescription("");
    setHint("");
    setFile(null);
    setFlag("");

    // Close the edit form
    setIsEditFormOpen(false);

    // Refetch challenges to update the table
    fetchChallenges();
  } catch (error) {
    console.error("Error updating challenge:", error);
    setError(error.message);

    // Show error toast
    toast.error(`Error: ${error.message}`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }
};


  return (
    <div className="flex min-h-screen text-white bg-gray-900">
      <Sidebar active={active} setActive={setActive} />
      <main className="relative flex flex-col items-center flex-1 gap-8 p-10 ml-64 overflow-hidden">
        <ToastContainer />
        <h1 className="mb-4 text-4xl font-extrabold text-center md:text-6xl text-cyan-500 drop-shadow-md">
          Challenges
        </h1>

        {/* Create Challenge Button */}
        <button
          className="p-2 font-semibold text-white rounded bg-cyan-500 hover:bg-cyan-600"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? "Hide Form" : "Create Challenge"}
        </button>

        {/* Error Message */}
        {error && (
          <div className="p-4 mb-4 text-white bg-red-500 rounded-lg">{error}</div>
        )}

        {/* Create Challenge Form */}
        {showCreateForm && (
          <form
            onSubmit={handleCreateChallenge}
            className="w-full max-w-4xl p-6 bg-gray-800 rounded-lg shadow-lg"
          >
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block mb-1 text-gray-300">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 text-gray-300 bg-gray-700 border border-gray-600 rounded"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block mb-1 text-gray-300">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2 text-gray-300 bg-gray-700 border border-gray-600 rounded"
                  required
                >
                  <option value="" disabled>Select a category</option>
                  <option value="Web">Web</option>
                  <option value="Crypto">Crypto</option>
                  <option value="Forensics">Forensics</option>
                  <option value="Reverse Engineering">Reverse Engineering</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block mb-1 text-lg font-semibold text-gray-300">
                  Description
                </label>
                <p className="mb-2 text-sm text-gray-400">
                  Provide a detailed description of the challenge. Markdown is supported.
                </p>
                <ReactQuill
                  value={description}
                  onChange={setDescription}
                  modules={modules}
                  className="h-[150px] text-white bg-gray-800 border border-gray-600 rounded-lg overflow-y-clip"
                  theme="snow"
                />
              </div>

              {/* Hint (Optional) */}
              <div>
                <label className="block mb-1 text-gray-300">Hint (Optional)</label>
                <input
                  type="text"
                  value={hint}
                  onChange={(e) => setHint(e.target.value)}
                  className="w-full p-2 text-gray-300 bg-gray-700 border border-gray-600 rounded"
                />
              </div>

              {/* File Upload (Optional) */}
              <div>
                <label className="block mb-1 text-gray-300">Resource File (.rar/.zip) (Optional)</label>
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="w-full p-2 text-gray-300 bg-gray-700 border border-gray-600 rounded"
                  accept=".rar,.zip"
                />
              </div><br />

              <hr className="my-12 h-0.5 border-t-0 bg-white/30" />

              {/* Points Method */}
              <div className="relative">
                <div className="p-4 mb-4 bg-gray-800 rounded-lg shadow-md">
                  <label className="block text-lg font-semibold text-gray-200">Points Method</label>
                  <p className="mt-1 ml-1 text-sm text-gray-400">
                    How the dynamic value will be calculated based on the Decay value :
                  </p>
                  <div className="mt-2 space-y-1 text-sm text-gray-300">
                    <p className="text-xs">
                      <span className="ml-10 font-bold">• Linear :</span> Calculated as 
                      <code className="text-blue-400 "> Initial - (Decay * SolveCount)</code>
                    </p>
                    <p className="text-xs">
                      <span className="ml-10 font-bold ">• Logarithmic :</span> Calculated as 
                      <code className="text-blue-400 "> (((Minimum - Initial) / (Decay²)) * (SolveCount²)) + Initial</code>
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    className={`w-full p-2 text-gray-300 bg-gray-700 border border-gray-600 rounded ${
                      pointsMethod === "Standard" ? "bg-green-600 text-white" : ""
                    }`}
                    onClick={() => setPointsMethod("Standard")}
                  >
                    Standard
                  </button>
                  <button
                    type="button"
                    className={`w-full p-2 text-gray-300 bg-gray-700 border border-gray-600 rounded ${
                      pointsMethod === "Linear" ? "bg-green-600 text-white" : ""
                    }`}
                    onClick={() => setPointsMethod("Linear")}
                  >
                    Linear
                  </button>
                  <button
                    type="button"
                    className={`w-full p-2 text-gray-300 bg-gray-700 border border-gray-600 rounded ${
                      pointsMethod === "Logarithmic" ? "bg-green-600 text-white" : ""
                    }`}
                    onClick={() => setPointsMethod("Logarithmic")}
                  >
                    Logarithmic
                  </button>
                </div>
              </div>

              {/* Points Input (Standard) */}
              {pointsMethod === "Standard" && (
                <div>
                  <label className="block text-gray-300">Points</label>
                  <p className="mt-1 mb-1 ml-1 text-sm text-gray-400">
                    This is how many points are rewarded for solving this challenge.
                  </p><br />
                  <input
                    type="number"
                    value={points}
                    onChange={(e) => setPoints(e.target.value)}
                    className="w-full p-2 text-gray-300 bg-gray-700 border border-gray-600 rounded"
                    required
                  />
                </div>
              )}

              {/* Initial Value, Decay Value, Minimum Value (Linear/Logarithmic) */}
              {(pointsMethod === "Linear" || pointsMethod === "Logarithmic") && (
                <>
                  {/* Initial Value */}
                  <div>
                    <label className="block text-gray-300">Initial Value</label>
                    <p className="mt-1 mb-1 ml-1 text-sm text-gray-400">
                      This is how many points the challenge is worth initially.
                    </p><br />
                    <input
                      type="number"
                      value={initialValue}
                      onChange={(e) => setInitialValue(e.target.value)}
                      className="w-full p-2 text-gray-300 bg-gray-700 border border-gray-600 rounded"
                      required
                    />
                  </div>

                  {/* Decay Value */}
                  <div>
                    <label className="block text-gray-300">Decay Value</label>
                    {pointsMethod === "Linear" && (
                      <p className="mt-1 mb-1 ml-1 text-sm text-gray-400">
                        The decay value is used differently depending on the above Decay Function : <br />
                        <span className="ml-5 font-semibold text-blue-400">Linear:</span> The amount of points deducted per solve. Equal deduction per solve.
                      </p>
                    )}
                    {pointsMethod === "Logarithmic" && (
                      <p className="mt-1 mb-1 ml-1 text-sm text-gray-400">
                        The decay value is used differently depending on the above Decay Function : <br />
                        <span className="ml-5 font-semibold text-blue-400">Logarithmic:</span> The amount of solves before the challenge reaches its minimum value. Earlier solves will lose less <span className="ml-5">points. Later solves will lose more points.</span> 
                      </p>
                    )}
                    <br />
                    <input
                      type="number"
                      value={decayValue}
                      onChange={(e) => setDecayValue(e.target.value)}
                      className="w-full p-2 text-gray-300 bg-gray-700 border border-gray-600 rounded"
                      required
                    />
                  </div>

                  {/* Minimum Value */}
                  <div>
                    <label className="block text-gray-300">Minimum Value</label>
                    <p className="mt-1 mb-1 ml-1 text-sm text-gray-400">
                      This is the lowest that the challenge can be worth.
                    </p>                    <input
                      type="number"
                      value={minimumValue}
                      onChange={(e) => setMinimumValue(e.target.value)}
                      className="w-full p-2 text-gray-300 bg-gray-700 border border-gray-600 rounded"
                      required
                    />
                  </div>
                </>
              )}

              <br />
              <hr className="my-12 h-0.5 border-t-0 bg-white/30" /><br />

              {/* Flag */}
              <div>
                <label className="block mb-2 text-gray-300">Flag</label>
                <input
                  type="text"
                  value={flag}
                  onChange={(e) => setFlag(e.target.value)}
                  className="w-full p-2 text-gray-300 bg-gray-700 border border-gray-600 rounded"
                  required
                />
              </div><br />

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full p-2 font-semibold text-white rounded bg-cyan-500 hover:bg-cyan-600"
              >
                Create Challenge
              </button>
            </div>
          </form>
        )}

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
              <option value="Title">Title</option>
              <option value="Category">Category</option>
            </select>

            <input
              type="text"
              className="p-2 w-[600px] bg-gray-800 border border-gray-700 rounded text-gray-300 focus:ring-2 focus:ring-cyan-400 ml-4"
              placeholder="Search challenges..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Edit & Delete Buttons */}
          <div className="flex gap-2">
            <button
              className="p-2 text-gray-300 bg-gray-800 rounded hover:bg-gray-700 disabled:opacity-50"
              onClick={() => {
                if (selectedRows.length === 1) {
                  handleEdit(selectedRows[0]); // Edit the first selected challenge
                } else {
                  toast.error("Please select exactly one challenge to edit.");
                }
              }}
              disabled={selectedRows.length !== 1} // Disable if not exactly one row is selected
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
        {isEditFormOpen && (
  <form
    onSubmit={handleEditChallenge}
    className="relative w-full max-w-4xl p-6 bg-gray-800 rounded-lg shadow-lg" // Add `relative` for positioning the close button
  >
    {/* Close Button (X) */}
    <button
      type="button"
      className="absolute p-1 text-gray-300 top-2 right-2 hover:text-white"
      onClick={() => setIsEditFormOpen(false)} // Close the form
      aria-label="Close"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>

    {/* Rest of the Edit Form */}
    <div className="space-y-4">
      {/* Title */}
      <div>
        <label className="block mb-1 text-gray-300">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 text-gray-300 bg-gray-700 border border-gray-600 rounded"
          required
        />
      </div>

      {/* Category */}
      <div>
        <label className="block mb-1 text-gray-300">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 text-gray-300 bg-gray-700 border border-gray-600 rounded"
          required
        >
          <option value="" disabled>Select a category</option>
          <option value="Web">Web</option>
          <option value="Crypto">Crypto</option>
          <option value="Forensics">Forensics</option>
          <option value="Reverse Engineering">Reverse Engineering</option>
        </select>
      </div>

      {/* Description */}
      <div>
        <label className="block mb-1 text-lg font-semibold text-gray-300">
          Description
        </label>
        <p className="mb-2 text-sm text-gray-400">
          Provide a detailed description of the challenge. Markdown is supported.
        </p>
        <ReactQuill
          value={description}
          onChange={setDescription}
          modules={modules}
          className="h-[150px] text-white bg-gray-800 border border-gray-600 rounded-lg overflow-y-clip"
          theme="snow"
        />
      </div>

      {/* Hint (Optional) */}
      <div>
        <label className="block mb-1 text-gray-300">Hint (Optional)</label>
        <input
          type="text"
          value={hint}
          onChange={(e) => setHint(e.target.value)}
          className="w-full p-2 text-gray-300 bg-gray-700 border border-gray-600 rounded"
        />
      </div>

      {/* File Upload (Optional) */}
      <div>
        <label className="block mb-1 text-gray-300">Resource File (.rar/.zip) (Optional)</label>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full p-2 text-gray-300 bg-gray-700 border border-gray-600 rounded"
          accept=".rar,.zip"
        />
      </div><br />

      {/* Points Method */}
      <div className="relative">
        <div className="p-4 mb-4 bg-gray-800 rounded-lg shadow-md">
          <label className="block text-lg font-semibold text-gray-200">Points Method</label>
          <p className="mt-1 ml-1 text-sm text-gray-400">
            How the dynamic value will be calculated based on the Decay value :
          </p>
          <div className="mt-2 space-y-1 text-sm text-gray-300">
            <p className="text-xs">
              <span className="ml-10 font-bold">• Linear :</span> Calculated as 
              <code className="text-blue-400 "> Initial - (Decay * SolveCount)</code>
            </p>
            <p className="text-xs">
              <span className="ml-10 font-bold ">• Logarithmic :</span> Calculated as 
              <code className="text-blue-400 "> (((Minimum - Initial) / (Decay²)) * (SolveCount²)) + Initial</code>
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            type="button"
            className={`w-full p-2 text-gray-300 bg-gray-700 border border-gray-600 rounded ${
              pointsMethod === "Standard" ? "bg-green-600 text-white" : ""
            }`}
            onClick={() => setPointsMethod("Standard")}
          >
            Standard
          </button>
          <button
            type="button"
            className={`w-full p-2 text-gray-300 bg-gray-700 border border-gray-600 rounded ${
              pointsMethod === "Linear" ? "bg-green-600 text-white" : ""
            }`}
            onClick={() => setPointsMethod("Linear")}
          >
            Linear
          </button>
          <button
            type="button"
            className={`w-full p-2 text-gray-300 bg-gray-700 border border-gray-600 rounded ${
              pointsMethod === "Logarithmic" ? "bg-green-600 text-white" : ""
            }`}
            onClick={() => setPointsMethod("Logarithmic")}
          >
            Logarithmic
          </button>
        </div>
      </div>

      {/* Points Input (Standard) */}
      {pointsMethod === "Standard" && (
        <div>
          <label className="block text-gray-300">Points</label>
          <p className="mt-1 mb-1 ml-1 text-sm text-gray-400">
            This is how many points are rewarded for solving this challenge.
          </p><br />
          <input
            type="number"
            value={points}
            onChange={(e) => setPoints(e.target.value)}
            className="w-full p-2 text-gray-300 bg-gray-700 border border-gray-600 rounded"
            required
          />
        </div>
      )}

      {/* Initial Value, Decay Value, Minimum Value (Linear/Logarithmic) */}
      {(pointsMethod === "Linear" || pointsMethod === "Logarithmic") && (
        <>
          {/* Initial Value */}
          <div>
            <label className="block text-gray-300">Initial Value</label>
            <p className="mt-1 mb-1 ml-1 text-sm text-gray-400">
              This is how many points the challenge is worth initially.
            </p><br />
            <input
              type="number"
              value={initialValue}
              onChange={(e) => setInitialValue(e.target.value)}
              className="w-full p-2 text-gray-300 bg-gray-700 border border-gray-600 rounded"
              required
            />
          </div>

          {/* Decay Value */}
          <div>
            <label className="block text-gray-300">Decay Value</label>
            {pointsMethod === "Linear" && (
              <p className="mt-1 mb-1 ml-1 text-sm text-gray-400">
                The decay value is used differently depending on the above Decay Function : <br />
                <span className="ml-5 font-semibold text-blue-400">Linear:</span> The amount of points deducted per solve. Equal deduction per solve.
              </p>
            )}
            {pointsMethod === "Logarithmic" && (
              <p className="mt-1 mb-1 ml-1 text-sm text-gray-400">
                The decay value is used differently depending on the above Decay Function : <br />
                <span className="ml-5 font-semibold text-blue-400">Logarithmic:</span> The amount of solves before the challenge reaches its minimum value. Earlier solves will lose less <span className="ml-5">points. Later solves will lose more points.</span> 
              </p>
            )}
            <br />
            <input
              type="number"
              value={decayValue}
              onChange={(e) => setDecayValue(e.target.value)}
              className="w-full p-2 text-gray-300 bg-gray-700 border border-gray-600 rounded"
              required
            />
          </div>

          {/* Minimum Value */}
          <div>
            <label className="block text-gray-300">Minimum Value</label>
            <p className="mt-1 mb-1 ml-1 text-sm text-gray-400">
              This is the lowest that the challenge can be worth.
            </p>                    <input
              type="number"
              value={minimumValue}
              onChange={(e) => setMinimumValue(e.target.value)}
              className="w-full p-2 text-gray-300 bg-gray-700 border border-gray-600 rounded"
              required
            />
          </div>
        </>
      )}

      <br />
      <hr className="my-12 h-0.5 border-t-0 bg-white/30" /><br />

      {/* Flag */}
      <div>
        <label className="block mb-2 text-gray-300">Flag</label>
        <input
          type="text"
          value={flag}
          onChange={(e) => setFlag(e.target.value)}
          className="w-full p-2 text-gray-300 bg-gray-700 border border-gray-600 rounded"
          required
        />
      </div><br />

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full p-2 font-semibold text-white rounded bg-cyan-500 hover:bg-cyan-600"
      >
        Update Challenge
      </button>
    </div>
  </form>
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
                <th className="px-4 py-2 text-left border border-gray-700">Title</th>
                <th className="px-4 py-2 text-left border border-gray-700">Category</th>
                <th className="px-4 py-2 text-left border border-gray-700">Value</th>
              </tr>
            </thead>
            <tbody>
            {filteredData.map((challenge, index) => (
  <tr key={challenge.id} className={`${index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"} text-gray-300 hover:bg-gray-600`}>
    <td className="w-12 px-2 py-2 text-center border border-gray-700">
      <input
        type="checkbox"
        onChange={() => {
          setSelectedRows((prevSelectedRows) =>
            prevSelectedRows.includes(challenge.id)
              ? prevSelectedRows.filter((rowId) => rowId !== challenge.id)
              : [...prevSelectedRows, challenge.id]
          );
        }}
        checked={selectedRows.includes(challenge.id)}
      />
    </td>
    <td className="px-4 py-2 border border-gray-700">{challenge.id}</td>
    <td className="px-4 py-2 border border-gray-700">{challenge.title}</td>
    <td className="px-4 py-2 border border-gray-700">{challenge.category}</td>
    <td className="px-4 py-2 border border-gray-700">{challenge.points}</td>
  </tr>
))}
            </tbody>
          </table>
        </div>

        {/* Confirmation Popup */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
              <p className="text-lg text-gray-200">
                Are you sure you want to delete the selected challenges?
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
                  onClick={() => setIsDeleteModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

<style jsx>{`
  .custom-quill .ql-editor {
    min-height: 250px; /* Increase height */
    max-height: 400px; /* Optional max height */
    overflow-y: auto; /* Add scroll if needed */
  }
`}</style>