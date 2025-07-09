import React, { useState } from 'react';
import UserBar from '../../components/UserBar/UserBar';
import { FaInfoCircle } from 'react-icons/fa';

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

const Notifications = () => {
  return (
    <div className="bg-[#121212] min-h-screen pb-1 transition-colors duration-300">
      <UserBar />
      <div className="px-4 pt-28">
        <h1 className="mb-8 text-5xl font-extrabold text-center text-transparent bg-gradient-to-r from-gray-300 to-white bg-clip-text">
          Notifications
        </h1>

        <div className="flex flex-col items-center max-w-3xl gap-4 mx-auto mt-5">
          {dummyNotifications.map((notif) => (
            <div
              key={notif.id}
              className="w-full p-4 bg-[#1e1e1e] text-white rounded-xl shadow-md border border-gray-700 hover:bg-[#2a2a2a] transition-all"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <FaInfoCircle className="text-blue-400" />
                  <h2 className="text-lg font-semibold">{notif.title}</h2>
                </div>
                <span className="text-sm text-gray-400">{notif.time}</span>
              </div>
              <p className="text-sm text-gray-300">{notif.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
