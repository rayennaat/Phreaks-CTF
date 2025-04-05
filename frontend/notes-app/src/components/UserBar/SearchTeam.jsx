import React, { useState, useEffect, useRef } from "react";

const SearchTeam = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Name");
  const dropdownRef = useRef(null);

  const options = ["Name", "Affiliation", "Website"];

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-fit" ref={dropdownRef}>
      <button
        className="w-[150px] appearance-none bg-[#515151] text-zinc-400 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-[#707070] transition duration-200 rounded-sm py-2 pl-3 pr-10 shadow-sm text-left"
        onClick={toggleDropdown}
      >
        {selectedOption}
        <svg
          className="absolute top-1/2 right-3 transform -translate-y-1/2 pointer-events-none text-gray-400"
          width="10"
          height="6"
          viewBox="0 0 10 6"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        >
          <path d="M0 1L5 5L10 1" />
        </svg>
      </button>

      {isOpen && (
        <ul className="absolute left-0 mt-1 w-full bg-[#333] text-[#E0E0E0] rounded-sm shadow-lg z-50">
          {options.map((option, index) => (
            <li
              key={index}
              className="px-3 py-2 hover:bg-[#424242] cursor-pointer"
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchTeam;
