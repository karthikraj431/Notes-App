import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/ContextProvider";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaFilter } from "react-icons/fa";

const Navbar = ({ setQuery, isSidebarOpen, setSidebarOpen, onFilterSelect, currentFilter }) => {
  const { user } = useAuth();
  const [showFilter, setShowFilter] = useState(false);
  const filterRef = useRef(null);

  // Current date
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // Close filter dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilter(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filterOptions = [
    { label: "Completed Work", value: "completed" },
    { label: "Incomplete Work", value: "incomplete" },
    { label: "Date Uploaded (Ascending)", value: "dateAsc" },
    { label: "Date Uploaded (Descending)", value: "dateDesc" },
  ];

  return (
    <motion.nav
      className="flex justify-between items-center px-8 py-4 shadow-lg bg-white"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Left: User Avatar */}
      <div className="flex items-center gap-3">
        {user && (
          <div
            className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold cursor-pointer"
            onClick={() => setSidebarOpen(!isSidebarOpen)}
          >
            {user.name?.charAt(0).toUpperCase()}
          </div>
        )}
        {user && <span className="font-medium">Welcome {user.name.split(" ")[0]}</span>}
      </div>

      {/* Center: Search */}
      <div className="flex-1 flex justify-center">
        <input
          type="text"
          placeholder="Search notes..."
          onChange={(e) => setQuery(e.target.value)}
          className="w-full max-w-md px-3 py-1 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Right: Filter icon + Calendar */}
      <div className="flex items-center gap-4 relative">
        {/* Filter Icon */}
        <div
          ref={filterRef}
          className={`p-2 rounded-lg cursor-pointer border border-gray-300 hover:bg-gray-100 ${
            showFilter ? "bg-blue-100 border-blue-400" : ""
          }`}
          onClick={() => setShowFilter(!showFilter)}
        >
          <FaFilter className="text-blue-600" />
        </div>

        {/* Filter Dropdown */}
        {showFilter && (
          <div className="absolute right-12 top-12 w-52 bg-white shadow-lg border rounded-lg z-50">
            {filterOptions.map((opt) => (
              <div
                key={opt.value}
                className={`px-4 py-2 cursor-pointer hover:bg-blue-100 ${
                  currentFilter === opt.value ? "bg-blue-50 font-semibold" : ""
                }`}
                onClick={() => {
                  onFilterSelect(opt.value);
                  setShowFilter(false);
                }}
              >
                {opt.label}
              </div>
            ))}
          </div>
        )}

        {/* Calendar */}
        {user && (
          <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-lg border border-gray-300">
            <FaCalendarAlt className="text-blue-600" />
            <span className="text-sm font-medium">{formattedDate}</span>
          </div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;




// import React from "react";
// import { useAuth } from "../context/ContextProvider";
// import { motion } from "framer-motion";
// import { FaCalendarAlt, FaFilter } from "react-icons/fa";

// const Navbar = ({ setQuery, isSidebarOpen, setSidebarOpen, onFilterClick, filterActive }) => {
//   const { user } = useAuth();

//   // Current date
//   const currentDate = new Date();
//   const formattedDate = currentDate.toLocaleDateString("en-US", {
//     weekday: "short",
//     month: "short",
//     day: "numeric",
//     year: "numeric",
//   });

//   return (
//     <motion.nav
//       className="flex justify-between items-center px-8 py-4 shadow-lg bg-white"
//       initial={{ y: -50, opacity: 0 }}
//       animate={{ y: 0, opacity: 1 }}
//       transition={{ duration: 0.5 }}
//     >
//       {/* Left: User Avatar */}
//       <div className="flex items-center gap-3">
//         {user && (
//           <div
//             className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold cursor-pointer"
//             onClick={() => setSidebarOpen(!isSidebarOpen)}
//           >
//             {user.name?.charAt(0).toUpperCase()}
//           </div>
//         )}
//         {user && <span className="font-medium">Welcome {user.name.split(" ")[0]}</span>}
//       </div>

//       {/* Center: Search */}
//       <div className="flex-1 flex justify-center">
//         <input
//           type="text"
//           placeholder="Search notes..."
//           onChange={(e) => setQuery(e.target.value)}
//           className="w-full max-w-md px-3 py-1 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
//         />
//       </div>

//       {/* Right: Filter icon + Calendar */}
//       <div className="flex items-center gap-4">
//         {/* Filter Icon */}
//         <div
//           className={`p-2 rounded-lg cursor-pointer border border-gray-300 hover:bg-gray-100 ${
//             filterActive ? "bg-blue-100 border-blue-400" : ""
//           }`}
//           onClick={onFilterClick}
//         >
//           <FaFilter className="text-blue-600" />
//         </div>

//         {/* Calendar */}
//         {user && (
//           <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-lg border border-gray-300">
//             <FaCalendarAlt className="text-blue-600" />
//             <span className="text-sm font-medium">{formattedDate}</span>
//           </div>
//         )}
//       </div>
//     </motion.nav>
//   );
// };

// export default Navbar;
