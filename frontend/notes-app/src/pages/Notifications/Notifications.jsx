import React, { useState, useEffect } from 'react';
import UserBar from '../../components/UserBar/UserBar';
import { FaInfoCircle } from 'react-icons/fa';
import io from 'socket.io-client';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('connecting');

  // Format time to relative time
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

  // Fetch notifications from API
  const fetchNotifications = async () => {
    try {
      const res = await fetch("https://phreaks-ctf.onrender.com/api/notifications");
      const data = await res.json();
      setNotifications(Array.isArray(data) ? data : (data.notifications || []));
      setIsLoading(false);
    } catch (err) {
      setError("Failed to load notifications");
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Set up Socket.io connection with fallback
  useEffect(() => {
    let socket;
    let pollInterval;

    const setupRealtime = () => {
      // Try WebSocket first
      socket = io('https://phreaks-ctf.onrender.com', {
        reconnection: true,
        reconnectionAttempts: 3,
        reconnectionDelay: 1000,
        transports: ['websocket', 'polling'] // Try both transports
      });

      socket.on('connect', () => {
        setConnectionStatus('connected');
        console.log('WebSocket connected');
        if (pollInterval) clearInterval(pollInterval);
      });

      socket.on('new-notification', (notification) => {
        setNotifications(prev => [notification, ...prev]);
      });

      socket.on('connect_error', (err) => {
        console.error('WebSocket connection error:', err);
        setConnectionStatus('disconnected');
        
        // Fallback to polling if WebSocket fails
        if (!pollInterval) {
          console.log('Falling back to polling');
          pollInterval = setInterval(fetchNotifications, 5000);
        }
      });

      socket.on('disconnect', () => {
        setConnectionStatus('disconnected');
      });
    };

    setupRealtime();

    return () => {
      if (socket) socket.disconnect();
      if (pollInterval) clearInterval(pollInterval);
    };
  }, []);

  return (
    <div className="bg-[#121212] min-h-screen pb-1 transition-colors duration-300">
      <UserBar />
      <div className="px-4 pt-28">
        <h1 className="mb-8 text-5xl font-extrabold text-center text-transparent bg-gradient-to-r from-gray-300 to-white bg-clip-text">
          Notifications
        </h1>
        
        {/* Connection status indicator */}
        <div className={`text-center mb-4 text-sm ${
          connectionStatus === 'connected' ? 'text-green-400' : 'text-yellow-400'
        }`}>
          {connectionStatus === 'connected' 
            ? 'Real-time updates connected' 
            : 'Using fallback updates (refreshing every 5 seconds)'}
        </div>
        
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