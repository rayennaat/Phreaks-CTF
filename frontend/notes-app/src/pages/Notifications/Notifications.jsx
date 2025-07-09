import React, { useState } from 'react';
import UserBar from '../../components/UserBar/UserBar';

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'like',
      user: 'johndoe',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      content: 'liked your post',
      postPreview: 'Check out my new artwork!',
      time: '2 min ago',
      read: false
    },
    {
      id: 2,
      type: 'comment',
      user: 'janedoe',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
      content: 'commented: "This is amazing! 😍"',
      postPreview: 'My latest design project',
      time: '15 min ago',
      read: false
    },
    {
      id: 3,
      type: 'follow',
      user: 'alexsmith',
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
      content: 'started following you',
      time: '1 hour ago',
      read: true
    },
    {
      id: 4,
      type: 'mention',
      user: 'teamart',
      avatar: 'https://randomuser.me/api/portraits/lego/1.jpg',
      content: 'mentioned you in a post',
      postPreview: 'Our team showcase for @you',
      time: '3 hours ago',
      read: true
    }
  ]);

  const markAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      read: true
    })));
  };

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'like':
        return '❤️';
      case 'comment':
        return '💬';
      case 'follow':
        return '👤';
      case 'mention':
        return '📌';
      default:
        return '🔔';
    }
  };

  return (
    <div className="bg-[#121212] min-h-screen pb-1 transition-colors duration-300">
      <UserBar />
      <div className="max-w-2xl px-4 pt-24 mx-auto">
        <h1 className="mb-8 text-4xl font-extrabold text-center text-transparent bg-gradient-to-r from-gray-300 to-white bg-clip-text">
          Notifications
        </h1>
        
        <div className="flex justify-end mb-4">
          <button 
            onClick={markAllAsRead}
            className="text-sm text-gray-400 transition-colors hover:text-white"
          >
            Mark all as read
          </button>
        </div>
        
        <div className="space-y-3">
          {notifications.map(notification => (
            <div 
              key={notification.id}
              className={`p-4 rounded-lg transition-all duration-200 ${notification.read ? 'bg-gray-900/50' : 'bg-purple-900/20 border-l-4 border-purple-500'}`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-1 text-2xl">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <img 
                      src={notification.avatar} 
                      alt={notification.user} 
                      className="object-cover w-8 h-8 rounded-full"
                    />
                    <p className="font-medium text-white">
                      <span className="font-bold">@{notification.user}</span> {notification.content}
                    </p>
                  </div>
                  
                  {notification.postPreview && (
                    <div className="p-2 mt-2 ml-10 text-sm text-gray-300 rounded bg-gray-800/50">
                      "{notification.postPreview}"
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mt-2 ml-10">
                    <span className="text-xs text-gray-400">{notification.time}</span>
                    {!notification.read && (
                      <button 
                        onClick={() => markAsRead(notification.id)}
                        className="text-xs text-purple-400 hover:text-purple-300"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {notifications.length === 0 && (
            <div className="py-10 text-center text-gray-400">
              No notifications yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Notifications;