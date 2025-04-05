import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";

export default function AdminConfig() {
  const [active, setActive] = useState("Config");

  

  return (
    <div className="flex min-h-screen text-white bg-gray-900">
      <Sidebar active={active} setActive={setActive} />
      <main className="relative flex flex-col items-center flex-1 gap-10 p-8 ml-64 overflow-hidden">
      <h1 className="text-4xl font-extrabold text-center md:text-6xl text-cyan-500 drop-shadow-md">
        CONFIG
      </h1>
      <div></div>
      </main>
    </div>
  );
}


//bg-gradient-to-br from-gray-900 to-black