import React, { useState } from 'react';
import UserBar from '../../components/UserBar/UserBar';


const Notifications = () => {
   

  return (
    <div className="bg-[#121212] min-h-screen pb-1 transition-colors duration-300"> {/* Added background and min-h-screen */}
      <UserBar />
      <br /><br /><br /><br /><br /><br />
      <h1 className="mb-4 text-6xl font-extrabold text-center text-transparent bg-gradient-to-r from-gray-300 to-white bg-clip-text">
        Notifications
      </h1> <br /><br />
      <div className="container p-10 mx-auto">
        </div>
    </div> 
  );
}

export default Notifications
