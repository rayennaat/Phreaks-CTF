import { motion } from "framer-motion";
import { FiMoon, FiSun } from "react-icons/fi";
import { useDarkMode } from "./DarkModeContext";

const TOGGLE_CLASSES =
  "text-sm font-medium flex items-center justify-center py-2 transition-colors relative z-10 bg-transparent"; // Removed px, added justify-center

const DarkModeSwitcher = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <div className="absolute right-4 flex justify-end px-4 transition-colors duration-300"> {/* Updated alignment */}
      <SliderToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
    </div>
  );
};

const SliderToggle = ({ isDarkMode, toggleDarkMode }) => {
  return (
    <div className="relative inline-flex items-center rounded-full bg-gray-200 dark:bg-gray-700 h-8"> {/* Added h-8 */}
      <motion.div // Changed to motion.div for layout prop
        layout
        transition={{ type: "spring", damping: 15, stiffness: 250 }}
        className={`absolute inset-y-0 ${isDarkMode ? "right-0" : "left-0"} h-full w-8 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600`} // Fixed width and positioning
      />
      <button
        className={`${TOGGLE_CLASSES} w-8 ${!isDarkMode ? "text-white" : "text-slate-300"}`} // Fixed width
        onClick={toggleDarkMode}
      >
        <FiSun className="text-lg md:text-sm" />
      </button>
      <button
        className={`${TOGGLE_CLASSES} w-8 ${isDarkMode ? "text-white" : "text-slate-800"}`} // Fixed width
        onClick={toggleDarkMode}
      >
        <FiMoon className="text-lg md:text-m" />
      </button>
    </div>
  );
};

export default DarkModeSwitcher;
