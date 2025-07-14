import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";

export default function AdminNotifications() {
  const [active, setActive] = useState("notification");
  const [notifications, setNotifications] = useState([]);
  const [showPostPanel, setShowPostPanel] = useState(false);
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Add this line

  // Fetch notifications from API
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch("https://phreaks-ctf.onrender.com/api/notifications");
        const data = await res.json();
        
        // Ensure data is an array before setting it
        if (Array.isArray(data)) {
          setNotifications(data);
        } else {
          // If the API returns an object with notifications array
          setNotifications(data.notifications || []);
        }
        
        setIsLoading(false);
      } catch (err) {
        setError("Failed to fetch notifications");
        setIsLoading(false);
        console.error(err);
      }
    };

    fetchNotifications();
  }, []);

  const handlePostNotification = async () => {
    if (newNotification.title && newNotification.message) {
      try {
        const res = await fetch("https://phreaks-ctf.onrender.com/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: newNotification.title,
            message: newNotification.message
          }),
        });
        
        const data = await res.json();
        
        if (data.success && data.notification) {
          // Add the new notification to the local state
          setNotifications([data.notification, ...notifications]);
          setNewNotification({ title: '', message: '' });
          setShowPostPanel(false);
        } else {
          throw new Error(data.error || "Failed to post notification");
        }
      } catch (err) {
        console.error("Failed to post notification:", err);
        setError(err.message);
      }
    }
  };

  const handleDeleteNotification = async (id) => {
  try {
    const response = await fetch(`https://phreaks-ctf.onrender.com/api/notifications/${id}`, {
      method: 'DELETE'
    });
    
    if (response.ok) {
      setNotifications(notifications.filter(n => n._id !== id));
    } else {
      const errorData = await response.json();
      setError(errorData.message || "Failed to delete notification");
    }
  } catch (err) {
    setError("Network error - please try again");
  }
};

const confirmDeleteAll = () => {
  if (window.confirm("Are you sure you want to delete ALL notifications?")) {
    deleteAllNotifications();
  }
};

const deleteAllNotifications = async () => {
  try {
    const response = await fetch('https://phreaks-ctf.onrender.com/api/notifications', {
      method: 'DELETE'
    });
    
    if (response.ok) {
      setNotifications([]);
    } else {
      const errorData = await response.json();
      setError(errorData.message || "Failed to delete notifications");
    }
  } catch (err) {
    setError("Network error - please try again");
  }
};

  // Format time to relative time (e.g., "2 mins ago")
  const formatTime = (dateString) => {
    if (!dateString) return "Just now";
    
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now - date) / 1000);
    
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return `${interval} year${interval === 1 ? '' : 's'} ago`;
    
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return `${interval} month${interval === 1 ? '' : 's'} ago`;
    
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return `${interval} day${interval === 1 ? '' : 's'} ago`;
    
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return `${interval} hour${interval === 1 ? '' : 's'} ago`;
    
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return `${interval} minute${interval === 1 ? '' : 's'} ago`;
    
    return "Just now";
  };

  return (
    <div className="flex min-h-screen text-white bg-gray-900">
      <Sidebar active={active} setActive={setActive} />
      <main className="relative flex flex-col items-center flex-1 gap-6 p-8 ml-64 overflow-hidden">
        <h1 className="text-4xl font-extrabold text-center md:text-6xl text-cyan-500 drop-shadow-md">
          NOTIFICATIONS
        </h1>
        
        {/* Floating action button */}
        <button 
          onClick={() => setShowPostPanel(!showPostPanel)}
          className="fixed z-50 flex items-center justify-center w-16 h-16 transition-all duration-300 rounded-full shadow-lg right-10 bottom-10 bg-cyan-600 hover:bg-cyan-500 hover:scale-110"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>

        {/* Notification Post Panel */}
        {showPostPanel && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
            <div className="relative w-full max-w-2xl p-8 bg-gray-800 border shadow-2xl rounded-xl border-cyan-500/30 animate-fade-in-up">
              <button 
                onClick={() => setShowPostPanel(false)}
                className="absolute text-gray-400 top-4 right-4 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <h2 className="mb-6 text-2xl font-bold text-cyan-400">Post New Notification</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-300">Title</label>
                  <input
                    type="text"
                    value={newNotification.title}
                    onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="Notification title"
                  />
                </div>
                
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-300">Message</label>
                  <textarea
                    value={newNotification.message}
                    onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    rows={4}
                    placeholder="Notification message"
                  />
                </div>
                
                {error && <div className="p-2 text-sm text-red-500">{error}</div>}
                
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setShowPostPanel(false)}
                    className="px-6 py-2 text-sm font-medium text-white transition-colors bg-gray-600 rounded-lg hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePostNotification}
                    className="px-6 py-2 text-sm font-medium text-white transition-colors rounded-lg bg-cyan-600 hover:bg-cyan-500"
                    disabled={!newNotification.title || !newNotification.message}
                  >
                    Post Notification
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Table */}
        <div className="w-full max-w-4xl mt-20 overflow-hidden rounded-lg shadow-2xl">
          <div className="flex items-center justify-between p-4 bg-gray-800">
  <h2 className="text-xl font-semibold text-gray-300">Recent Notifications</h2>
  <div className="flex gap-2">
    <button 
      onClick={confirmDeleteAll}
      className="flex items-center px-4 py-2 text-sm font-medium text-white transition-colors bg-red-600 rounded-md hover:bg-red-500"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
      Clear All
    </button>
    <button 
      onClick={() => setShowPostPanel(true)}
      className="flex items-center px-4 py-2 text-sm font-medium text-white transition-colors rounded-md bg-cyan-600 hover:bg-cyan-500"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
      New Notification
    </button>
  </div>
</div>
          
          {isLoading ? (
            <div className="w-full py-12 text-center text-gray-500">
              Loading notifications...
            </div>
          ) : error ? (
            <div className="w-full py-12 text-center text-red-500">
              {error}
            </div>
          ) : (
            <table className="w-full border-collapse">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-4 text-sm font-medium tracking-wider text-left uppercase text-cyan-400">Time</th>
                  <th className="px-6 py-4 text-sm font-medium tracking-wider text-left uppercase text-cyan-400">Title</th>
                  <th className="px-6 py-4 text-sm font-medium tracking-wider text-left uppercase text-cyan-400">Message</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700 bg-gray-900/50">
                {notifications.map((notification) => (
  <tr key={notification._id} className="transition-colors duration-200 hover:bg-gray-800/70 group">
    <td className="px-6 py-4 text-sm text-gray-300 whitespace-nowrap">
      {formatTime(notification.createdAt)}
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-sm font-medium text-white">{notification.title}</div>
    </td>
    <td className="px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-400">{notification.message}</div>
        <button 
          onClick={() => handleDeleteNotification(notification._id)}
          className="invisible p-1 text-gray-400 rounded-md group-hover:visible hover:bg-gray-700 hover:text-red-400"
          title="Delete notification"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </td>
  </tr>
))}
              </tbody>
            </table>
          )}
          
          {!isLoading && !error && notifications.length === 0 && (
            <div className="w-full py-12 text-center text-gray-500">
              No notifications available
            </div>
          )}
        </div>

        {showDeleteModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
    <div className="p-6 bg-gray-800 rounded-lg">
      <h3 className="mb-4 text-lg font-medium">Delete All Notifications</h3>
      <p className="mb-6 text-gray-300">Are you sure you want to delete all notifications? This action cannot be undone.</p>
      <div className="flex justify-end gap-3">
        <button
          onClick={() => setShowDeleteModal(false)}
          className="px-4 py-2 text-sm text-white bg-gray-600 rounded-md hover:bg-gray-500"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            deleteAllNotifications();
            setShowDeleteModal(false);
          }}
          className="px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-500"
        >
          Delete All
        </button>
      </div>
    </div>
  </div>
)}
      </main>
    </div>
  );
}
