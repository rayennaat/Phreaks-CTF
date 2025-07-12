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
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [notifications, setNotifications] = useState(dummyNotifications);

  const handlePost = () => {
    if (!title || !message) return alert("Please fill in all fields.");

    const newNotification = {
      id: Date.now(),
      title,
      message,
      time: "Just now",
    };

    // Add it to the list (simulate backend push)
    setNotifications([newNotification, ...notifications]);
    console.log("New notification posted:", newNotification);

    // Reset form
    setTitle("");
    setMessage("");
    setShowForm(false);
  };

  return (
    <div className="flex min-h-screen text-white bg-gray-900">
      <Sidebar active={active} setActive={setActive} />
      <main className="relative flex flex-col items-center flex-1 gap-10 p-8 ml-64 overflow-hidden">
        <h1 className="text-4xl font-extrabold text-center md:text-6xl text-cyan-500 drop-shadow-md">
          NOTIFICATIONS
        </h1>

        {/* ➕ Create Notification Form */}
        <div className="w-full max-w-4xl">
          <button
            onClick={() => setShowForm((prev) => !prev)}
            className="px-5 py-2 mb-4 text-sm font-semibold tracking-wider uppercase transition-all rounded-lg shadow bg-cyan-600 hover:bg-cyan-700 hover:scale-105 focus:outline-none"
          >
            {showForm ? "Cancel" : "Post New Notification"}
          </button>

          {showForm && (
            <div className="p-6 mb-6 space-y-4 transition-all duration-300 ease-in-out bg-gray-800 rounded-lg shadow-lg">
              <input
                type="text"
                placeholder="Notification Title"
                className="w-full px-4 py-2 text-black rounded focus:outline-none"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <textarea
                placeholder="Notification Message"
                rows={3}
                className="w-full px-4 py-2 text-black rounded focus:outline-none"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button
                onClick={handlePost}
                className="px-4 py-2 text-white transition-all bg-green-600 rounded hover:bg-green-700 hover:scale-105"
              >
                Send Notification
              </button>
            </div>
          )}
        </div>

        {/* 🔔 Notification Table */}
        <div className="w-full max-w-4xl mt-4 overflow-hidden rounded-lg shadow-2xl">
          <table className="w-full border-collapse">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-4 text-sm font-medium tracking-wider text-left uppercase text-cyan-400">
                  Time
                </th>
                <th className="px-6 py-4 text-sm font-medium tracking-wider text-left uppercase text-cyan-400">
                  Title
                </th>
                <th className="px-6 py-4 text-sm font-medium tracking-wider text-left uppercase text-cyan-400">
                  Message
                </th>
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
                    <div className="text-sm font-medium text-white">
                      {notification.title}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-400">
                      {notification.message}
                    </div>
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
