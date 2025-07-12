import { useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";

const dummyNotifications = [
  {
    id: 1,
    title: 'Challenge Solved!',
    message: 'Your team just solved the "Web 101" challenge.',
    time: '2 mins ago',
  },
  {
    id: 2,
    title: 'New Challenge Added',
    message: 'A new Reverse Engineering challenge has been added.',
    time: '1 hour ago',
  },
  {
    id: 3,
    title: 'Team Invitation',
    message: 'You have been invited to join Team Xploiters.',
    time: 'Yesterday',
  },
];

export default function AdminNotifications() {
  const [active, setActive] = useState("notification");
  const [notifications, setNotifications] = useState(dummyNotifications);
  const [showPostPanel, setShowPostPanel] = useState(false);
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    time: 'Just now'
  });

  const handlePostNotification = () => {
    if (newNotification.title && newNotification.message) {
      const notification = {
        id: notifications.length + 1,
        title: newNotification.title,
        message: newNotification.message,
        time: newNotification.time
      };
      setNotifications([notification, ...notifications]);
      setNewNotification({ title: '', message: '', time: 'Just now' });
      setShowPostPanel(false);
    }
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
        <div className="w-full max-w-4xl mt-10 overflow-hidden rounded-lg shadow-2xl">
          <div className="flex items-center justify-between p-4 bg-gray-800">
            <h2 className="text-xl font-semibold text-gray-300">Recent Notifications</h2>
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
                <tr 
                  key={notification.id} 
                  className="transition-colors duration-200 hover:bg-gray-800/70"
                >
                  <td className="px-6 py-4 text-sm text-gray-300 whitespace-nowrap">
                    {notification.time}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">{notification.title}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-400">{notification.message}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {notifications.length === 0 && (
            <div className="w-full py-12 text-center text-gray-500">
              No notifications available
            </div>
          )}
        </div>
      </main>
    </div>
  );
}