import React, { useState, useEffect } from 'react';
import UserBar from '../../components/UserBar/UserBar';
import { FaInfoCircle } from 'react-icons/fa';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch notifications from API
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch("https://phreaks-ctf.onrender.com/api/notifications");
        const data = await res.json();
        
        // Handle both array response and object with notifications property
        const receivedNotifications = Array.isArray(data) ? data : (data.notifications || []);
        setNotifications(receivedNotifications);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to load notifications");
        setIsLoading(false);
        console.error(err);
      }
    };

    fetchNotifications();

    // Set up real-time updates if using Socket.io
    const setupRealTime = () => {
      if (global.io) {
        global.io.on('new-notification', (notification) => {
          setNotifications(prev => [notification, ...prev]);
        });
      }
    };

    setupRealTime();

    return () => {
      if (global.io) {
        global.io.off('new-notification');
      }
    };
  }, []);

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
    <div className="bg-[#121212] min-h-screen pb-1 transition-colors duration-300">
      <UserBar />
      <div className="px-4 pt-28">
        <h1 className="mb-8 text-5xl font-extrabold text-center text-transparent bg-gradient-to-r from-gray-300 to-white bg-clip-text">
          Notifications
        </h1>
        <br /><br />   
        
        {isLoading ? (
          <div className="flex justify-center">
            <div className="text-gray-400">Loading notifications...</div>
          </div>
        ) : error ? (
          <div className="flex justify-center">
            <div className="text-red-400">{error}</div>
          </div>
        ) : (
          <div className="flex flex-col items-center max-w-3xl gap-4 mx-auto">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <div
                  key={notif._id || notif.id}
                  className="w-full p-4 bg-[#1e1e1e] text-white rounded-xl shadow-md border border-gray-700 hover:bg-[#2a2a2a] transition-all"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <FaInfoCircle className="text-blue-400" />
                      <h2 className="text-lg font-semibold">{notif.title}</h2>
                    </div>
                    <span className="text-sm text-gray-400">
                      {formatTime(notif.createdAt || notif.time)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300">{notif.message}</p>
                </div>
              ))
            ) : (
              <div className="w-full p-8 text-center text-gray-400 bg-[#1e1e1e] rounded-xl">
                No notifications available
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;