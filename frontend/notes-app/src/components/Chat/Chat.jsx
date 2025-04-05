import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addMessage } from "../../slices";
import { FaCommentDots } from "react-icons/fa";


const Chat = () => {
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.chat.messages);
  const [newMessage, setNewMessage] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isEntering, setIsEntering] = useState(false);

  // Handle the animation delay when component is mounted
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsEntering(true); // Trigger animation after 1 second
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      dispatch(addMessage({ sender: "You", text: newMessage }));
      setNewMessage("");
    }
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="relative">
      {/* Floating Chat Button with Animation */}
      {!isChatOpen && (
        <button
          onClick={toggleChat}
          className={`fixed bottom-6 right-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white p-4 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-none z-50 ${isEntering ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
        >
          <FaCommentDots size={26} />
        </button>
      )}

      {/* Chat Window */}
      {isChatOpen && (
        <div
          className="fixed right-6 h-[450px] w-96 bg-white rounded-lg shadow-lg z-50 transform transition-all duration-500 ease-in-out scale-100"
          style={{
            bottom: "30px", // Adjusted to make the window closer to the bottom
            transformOrigin: "bottom right",
            transitionProperty: "bottom, transform",
          }}
        >
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 rounded-t-lg flex justify-between items-center">
            <span className="text-lg font-semibold">Team Chat</span>
            <button
              onClick={toggleChat}
              className="text-white hover:text-gray-200 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="h-[315px] overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className="flex flex-col space-y-1">
                <span className="text-sm font-semibold text-blue-600">
                  {msg.sender}:
                </span>
                <p className="text-gray-700">{msg.text}</p>
              </div>
            ))}
          </div>
          <div className="flex p-4 border-t border-gray-300">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            <button
              onClick={handleSendMessage}
              className="ml-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white px-6 py-3 rounded-md transition-all duration-200 ease-in-out focus:outline-none"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
