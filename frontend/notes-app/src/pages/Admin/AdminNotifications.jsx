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

  return (
    <div className="flex min-h-screen text-white bg-gray-900">
      <Sidebar active={active} setActive={setActive} />
      <main className="relative flex flex-col items-center flex-1 gap-10 p-8 ml-64 overflow-hidden">
        <h1 className="text-4xl font-extrabold text-center md:text-6xl text-cyan-500 drop-shadow-md">
          NOTIFICATIONS
        </h1>
        
        <div className="w-full max-w-4xl mt-20 overflow-hidden rounded-lg shadow-2xl">
          <table className="w-full border-collapse">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-4 text-sm font-medium tracking-wider text-left uppercase text-cyan-400">Time</th>
                <th className="px-6 py-4 text-sm font-medium tracking-wider text-left uppercase text-cyan-400">Title</th>
                <th className="px-6 py-4 text-sm font-medium tracking-wider text-left uppercase text-cyan-400">Message</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700 bg-gray-900/50">
              {dummyNotifications.map((notification) => (
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
          
          {dummyNotifications.length === 0 && (
            <div className="w-full py-12 text-center text-gray-500">
              No notifications available
            </div>
          )}
        </div>
      </main>
    </div>
  );
}