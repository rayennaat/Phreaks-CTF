import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import { ToastContainer, toast } from "react-toastify"; // Import ToastContainer and toast
import "react-toastify/dist/ReactToastify.css"; // Import the CSS
import { FaTrash } from "react-icons/fa"; // Import FaTrash icon

export default function AdminWriteups() {
  const [active, setActive] = useState("Writeups");
  const [pendingWriteups, setPendingWriteups] = useState([]);
  const [approvedWriteups, setApprovedWriteups] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // For delete confirmation modal
  const [deleteType, setDeleteType] = useState(null); // "single" or "all"
  const [deleteId, setDeleteId] = useState(null); // ID of the writeup to delete

  useEffect(() => {
    fetchWriteups();
  }, []);

  // Fetch writeups from backend
  async function fetchWriteups() {
    try {
      const res = await fetch("https://phreaks-ctf.onrender.com/api/writeups/admin"); // New API route for admin
      const data = await res.json();
      setPendingWriteups(data.pending);
      setApprovedWriteups(data.approved);
    } catch (error) {
      console.error("Error fetching writeups:", error);
    }
  }

  // Approve a writeup
  async function approveWriteup(id) {
    try {
      const res = await fetch(`https://phreaks-ctf.onrender.com/api/writeups/${id}/approve`, {
        method: "PUT",
      });

      if (res.ok) {
        setPendingWriteups((prev) => prev.filter((w) => w._id !== id)); // Remove from pending
        fetchWriteups(); // Refresh the list
        toast.success("Writeup approved successfully!"); // Show success toast
      } else {
        console.error("Failed to approve writeup");
        toast.error("Failed to approve writeup."); // Show error toast
      }
    } catch (error) {
      console.error("Error approving writeup:", error);
      toast.error("Error approving writeup."); // Show error toast
    }
  }

  // Handle delete click (single or all)
  const handleDeleteClick = (id = null, status = 'approved') => {
    setDeleteType(status === 'pending' ? 'pendingSingle' : id ? 'single' : 'all');
    setDeleteId(id);
    setIsModalOpen(true);
  };
  
  // Confirm delete action
  const confirmDelete = async () => {
    try {
      if (deleteType === "single") {
        // Delete a single approved writeup
        await fetch(`https://phreaks-ctf.onrender.com/api/writeups/${deleteId}`, {
          method: "DELETE",
        });
        setApprovedWriteups((prev) => prev.filter((w) => w._id !== deleteId));
        toast.success("Writeup deleted successfully!");
  
      } else if (deleteType === "pendingSingle") {
        // Delete a single pending writeup
        await fetch(`https://phreaks-ctf.onrender.com/api/writeups/${deleteId}`, {
          method: "DELETE",
        });
        setPendingWriteups((prev) => prev.filter((w) => w._id !== deleteId));
        toast.success("Pending writeup deleted successfully!");
  
      } else {
        // Delete all approved writeups
        await fetch("https://phreaks-ctf.onrender.com/api/writeups", {
          method: "DELETE",
        });
        setApprovedWriteups([]);
        toast.success("All writeups deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting writeup(s):", error);
      toast.error("Failed to delete writeup(s). Please try again.");
    }
  
    setIsModalOpen(false);
  };
  
  
  
  return (
    <div className="flex min-h-screen text-white bg-gray-900">
      <Sidebar active={active} setActive={setActive} />
      <main className="relative flex flex-col items-center flex-1 gap-10 p-8 ml-64 overflow-hidden">
    
        <h1 className="text-4xl font-extrabold text-center md:text-6xl text-cyan-500 drop-shadow-md">
          WRITEUPS
        </h1>
        {/* Toast Container */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />

        {/* Pending Writeups */}
        <div className="w-full max-w-3xl">
          <h2 className="text-xl font-bold text-red-400">Pending Writeups</h2>
          {pendingWriteups.length === 0 ? (
            <p className="text-gray-400">No pending writeups.</p>
          ) : (
            pendingWriteups.map((writeup) => (
              <div
                key={writeup._id}
                className="p-4 mt-4 bg-gray-800 border border-red-500 rounded-lg"
              >
                <h3 className="text-lg font-semibold">{writeup.title}</h3>
                <p className="text-sm text-gray-400">
                  {writeup.author} • {new Date(writeup.date).toLocaleDateString()}
                </p>
                <p className="mt-2">{writeup.summary}</p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => approveWriteup(writeup._id)}
                    className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <a
                    href={`/writeups/${writeup._id}`} // Link to the writeup's review page
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                  >
                    Review
                  </a>
                  {/* ✅ NEW DELETE BUTTON */}
                  <button
                    onClick={() => handleDeleteClick(writeup._id, 'pending')}
                    className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Approved Writeups Table */}
        <div className="w-full max-w-4xl">
          <h2 className="text-xl font-bold text-green-400">Approved Writeups</h2>
          <div className="overflow-x-auto">
            <table className="w-full mt-4 border border-gray-700">
              <thead>
                <tr className="text-left border-b border-gray-700">
                  <th className="p-2">Title</th>
                  <th className="p-2">Author</th>
                  <th className="p-2">Category</th> {/* ✅ Added Category column */}
                  <th className="p-2">Date</th>
                  <th className="p-2">Likes</th>
                  <th className="p-2 text-center">
                    <FaTrash
                      className="text-red-500 cursor-pointer hover:text-red-700"
                      onClick={() => handleDeleteClick()} // Delete all writeups
                    />
                  </th>
                </tr>
              </thead>
              <tbody>
                {approvedWriteups.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-4 text-center text-gray-400">
                      No approved writeups.
                    </td>
                  </tr>
                ) : (
                  approvedWriteups.map((writeup) => (
                    <tr key={writeup._id} className="border-b border-gray-700">
                      <td className="p-2">{writeup.title}</td>
                      <td className="p-2">{writeup.author}</td>
                      <td className="p-2">{writeup.category}</td> {/* ✅ Display category */}
                      <td className="p-2">{new Date(writeup.date).toLocaleDateString()}</td>
                      <td className="p-2">{writeup.likes.length}</td>
                      <td className="p-2 text-center">
                        <FaTrash
                          className="text-red-500 cursor-pointer hover:text-red-700"
                          onClick={() => handleDeleteClick(writeup._id)} // Delete single writeup
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal for Confirmation */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
              <p className="text-lg text-gray-200">
                {deleteType === "single"
                  ? "Are you sure you want to delete this writeup?"
                  : "Are you sure you want to delete all writeups?"}
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
      </main>
    </div>
  );
}