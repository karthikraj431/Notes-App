import React, { useState } from "react";
import { FaFilter, FaPlus } from "react-icons/fa";

const Navbar = ({ setQuery, onFilterSelect, currentFilter, onNewNoteClick }) => {
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white shadow">
      <input
        type="text"
        placeholder="Search notes..."
        onChange={(e) => setQuery(e.target.value)}
        className="border rounded-lg px-4 py-2 w-1/3"
      />

      <div className="flex items-center space-x-4">
        <div className="relative">
          <button
            onClick={() => setShowFilterMenu((prev) => !prev)}
            className="px-4 py-2 bg-indigo-500 text-white rounded-lg flex items-center gap-2"
          >
            <FaFilter /> Filter
          </button>

          {showFilterMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg border rounded-lg z-50">
              {[
                { label: "All", value: "all" },
                { label: "Today", value: "today" },
                { label: "Scheduled", value: "scheduled" },
                { label: "Favorites", value: "favorites" },
                { label: "Completed", value: "completed" },
                { label: "Incomplete", value: "incomplete" },
              ].map((f) => (
                <button
                  key={f.value}
                  onClick={() => {
                    onFilterSelect(f.value);
                    setShowFilterMenu(false);
                  }}
                  className={`block w-full text-left px-4 py-2 hover:bg-indigo-50 ${
                    currentFilter === f.value ? "text-indigo-600 font-medium" : ""
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={onNewNoteClick}
          className="px-4 py-2 bg-green-500 text-white rounded-lg flex items-center gap-2"
        >
          <FaPlus /> New Note
        </button>
      </div>
    </nav>
  );
};

export default Navbar;





// import React, { useEffect, useRef, useState } from "react";
// import { useAuth } from "../context/ContextProvider";
// import { motion } from "framer-motion";
// import { FaFilter, FaCalendarAlt, FaPlus } from "react-icons/fa";

// const Navbar = ({
//   setQuery,
//   isSidebarOpen,
//   setSidebarOpen,
//   onFilterSelect,
//   currentFilter,
//   onDateSelect,
//   onNewNoteClick,
// }) => {
//   const { user } = useAuth();
//   const [isFilterOpen, setFilterOpen] = useState(false);
//   const [isCalendarOpen, setCalendarOpen] = useState(false);
//   const [selectedDate, setSelectedDate] = useState("");
//   const filterRef = useRef();
//   const calendarRef = useRef();

//   const filterOptions = [
//     { label: "All Notes", value: "all" },
//     { label: "Today", value: "today" },
//     { label: "Scheduled", value: "scheduled" },
//     { label: "Favorites", value: "favorites" },
//     { label: "Completed", value: "completed" },
//     { label: "Incomplete", value: "incomplete" },
//   ];

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (filterRef.current && !filterRef.current.contains(e.target)) setFilterOpen(false);
//       if (calendarRef.current && !calendarRef.current.contains(e.target)) setCalendarOpen(false);
//     };
//     window.addEventListener("mousedown", handleClickOutside);
//     return () => window.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <motion.nav
//       className="flex items-center justify-between px-6 py-4 bg-white shadow-md sticky top-0 z-40"
//       initial={{ y: -30, opacity: 0 }}
//       animate={{ y: 0, opacity: 1 }}
//       transition={{ duration: 0.35 }}
//     >
//       {/* Left */}
//       <div className="flex items-center gap-4">
//         <div className="text-2xl font-bold text-indigo-600">NOTES</div>
//         {user && (
//           <button
//             className="flex items-center gap-2 text-sm text-gray-700"
//             onClick={() => setSidebarOpen(!isSidebarOpen)}
//             aria-label="Open profile"
//           >
//             <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
//               {user.name?.charAt(0)?.toUpperCase() || "U"}
//             </div>
//             <span className="hidden sm:inline">Hi, {user.name?.split(" ")[0]}</span>
//           </button>
//         )}
//       </div>

//       {/* Center: search */}
//       <div className="flex-1 flex justify-center">
//         <input
//           type="text"
//           placeholder="Search notes..."
//           onChange={(e) => setQuery(e.target.value)}
//           className="w-full max-w-2xl px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm"
//         />
//       </div>

//       {/* Right */}
//       <div className="flex items-center gap-4">
//         {/* Filter */}
//         <div className="relative" ref={filterRef}>
//           <button
//             onClick={() => setFilterOpen((s) => !s)}
//             className={`p-2 rounded-lg border ${
//               currentFilter ? "bg-indigo-50 border-indigo-300" : "border-gray-200"
//             } hover:bg-gray-50`}
//             aria-label="Filter notes"
//           >
//             <FaFilter className="text-indigo-600" />
//           </button>

//           {isFilterOpen && (
//             <div className="absolute right-0 mt-2 w-60 bg-white border shadow-lg rounded-md z-50">
//               <div className="p-2 text-xs text-gray-500 border-b">Filters</div>
//               {filterOptions.map((opt) => (
//                 <div
//                   key={opt.value}
//                   className={`px-4 py-2 text-sm cursor-pointer hover:bg-indigo-50 ${
//                     currentFilter === opt.value ? "bg-indigo-100 font-medium" : ""
//                   }`}
//                   onClick={() => {
//                     onFilterSelect(opt.value);
//                     setFilterOpen(false);
//                   }}
//                 >
//                   {opt.label}
//                 </div>
//               ))}
//               <div
//                 className="px-4 py-2 text-sm cursor-pointer hover:bg-indigo-50 text-red-600"
//                 onClick={() => {
//                   onFilterSelect("");
//                   setFilterOpen(false);
//                 }}
//               >
//                 Clear Filter
//               </div>
//             </div>
//           )}
//         </div>

//         {/* New Note */}
//         <button
//           onClick={onNewNoteClick}
//           className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700"
//         >
//           <FaPlus />
//           <span className="hidden sm:inline">New Note</span>
//         </button>
//       </div>
//     </motion.nav>
//   );
// };

// export default Navbar;
