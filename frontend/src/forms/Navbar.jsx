import React, { useState } from "react";
import { useAuth } from "../context/ContextProvider";
import { motion } from "framer-motion";
import { FaFilter, FaCalendarAlt } from "react-icons/fa"; // Filter + Calendar
import { format } from "date-fns";

const Navbar = ({ setQuery, isSidebarOpen, setSidebarOpen, onFilterSelect, currentFilter }) => {
  const { user } = useAuth();
  const [isFilterOpen, setFilterOpen] = useState(false);
  const [isCalendarOpen, setCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const filterOptions = [
    { label: "Completed Work", value: "completed" },
    { label: "Incomplete Work", value: "incomplete" },
    { label: "Date Ascending", value: "dateAsc" },
    { label: "Date Descending", value: "dateDesc" },
  ];

  return (
    <motion.nav
      className="flex justify-between items-center px-8 py-4 shadow-lg bg-white relative"
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
      <input
        type="text"
        placeholder="Search notes..."
        onChange={(e) => setQuery(e.target.value)}
        className="px-3 py-1 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 w-1/3 text-center"
      />

      {/* Right: Filter + Calendar */}
      <div className="flex items-center gap-4 relative">
        {/* Filter */}
        <div className="relative">
          <FaFilter
            size={20}
            className="cursor-pointer text-gray-700 hover:text-blue-600"
            onClick={() => setFilterOpen(!isFilterOpen)}
          />
          {isFilterOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded-md z-50">
              {filterOptions.map((opt) => (
                <div
                  key={opt.value}
                  className={`px-4 py-2 cursor-pointer hover:bg-blue-100 ${
                    currentFilter === opt.value ? "bg-blue-100 font-semibold" : ""
                  }`}
                  onClick={() => {
                    onFilterSelect(opt.value);
                    setFilterOpen(false);
                  }}
                >
                  {opt.label}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Calendar */}
        <div className="relative">
          <FaCalendarAlt
            size={20}
            className="cursor-pointer text-gray-700 hover:text-blue-600"
            onClick={() => setCalendarOpen(!isCalendarOpen)}
          />
          {isCalendarOpen && (
            <div className="absolute right-0 mt-2 p-2 bg-white border border-gray-200 shadow-lg rounded-md z-50">
              <input
                type="date"
                value={format(selectedDate, "yyyy-MM-dd")}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                className="px-2 py-1 border rounded-md"
              />
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;



// import React, { useState } from "react";
// import { useAuth } from "../context/ContextProvider";
// import { motion } from "framer-motion";
// import { FaFilter } from "react-icons/fa"; // Filter icon

// const Navbar = ({ setQuery, isSidebarOpen, setSidebarOpen, onFilterSelect, currentFilter }) => {
//   const { user } = useAuth();
//   const [isFilterOpen, setFilterOpen] = useState(false);

//   const filterOptions = [
//     { label: "Completed Work", value: "completed" },
//     { label: "Incomplete Work", value: "incomplete" },
//     { label: "Date Ascending", value: "dateAsc" },
//     { label: "Date Descending", value: "dateDesc" },
//   ];

//   return (
//     <motion.nav
//       className="flex justify-between items-center px-8 py-4 shadow-lg bg-white relative"
//       initial={{ y: -50, opacity: 0 }}
//       animate={{ y: 0, opacity: 1 }}
//       transition={{ duration: 0.5 }}
//     >
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

//       {/* Search Bar in center */}
//       <input
//         type="text"
//         placeholder="Search notes..."
//         onChange={(e) => setQuery(e.target.value)}
//         className="px-3 py-1 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 w-1/3 text-center"
//       />

//       {/* Filter Icon */}
//       <div className="relative">
//         <FaFilter
//           size={20}
//           className="cursor-pointer text-gray-700 hover:text-blue-600"
//           onClick={() => setFilterOpen(!isFilterOpen)}
//         />
//         {isFilterOpen && (
//           <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded-md z-50">
//             {filterOptions.map((opt) => (
//               <div
//                 key={opt.value}
//                 className={`px-4 py-2 cursor-pointer hover:bg-blue-100 ${
//                   currentFilter === opt.value ? "bg-blue-100 font-semibold" : ""
//                 }`}
//                 onClick={() => {
//                   onFilterSelect(opt.value);
//                   setFilterOpen(false);
//                 }}
//               >
//                 {opt.label}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </motion.nav>
//   );
// };

// export default Navbar;
