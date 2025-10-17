import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/ContextProvider";
import { motion } from "framer-motion";
import { FaFilter, FaCalendarAlt, FaPlus } from "react-icons/fa";

const Navbar = ({
  setQuery,
  isSidebarOpen,
  setSidebarOpen,
  onFilterSelect,
  currentFilter,
  onDateSelect,
  onNewNoteClick,
}) => {
  const { user } = useAuth();
  const [isFilterOpen, setFilterOpen] = useState(false);
  const [isCalendarOpen, setCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const filterRef = useRef();
  const calendarRef = useRef();

  const filterOptions = [
    { label: "Completed Work", value: "completed" },
    { label: "Incomplete Work", value: "incomplete" },
    { label: "Date Uploaded (Ascending)", value: "dateAsc" },
    { label: "Date Uploaded (Descending)", value: "dateDesc" },
  ];

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) setFilterOpen(false);
      if (calendarRef.current && !calendarRef.current.contains(e.target)) setCalendarOpen(false);
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // format date for input value yyyy-mm-dd
  const formatDateForInput = (d) => {
    if (!d) return "";
    const dt = new Date(d);
    const yyyy = dt.getFullYear();
    const mm = String(dt.getMonth() + 1).padStart(2, "0");
    const dd = String(dt.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  return (
    <motion.nav
      className="flex items-center justify-between px-6 py-4 bg-white shadow-md sticky top-0 z-40"
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35 }}
    >
      {/* Left: logo + avatar */}
      <div className="flex items-center gap-4">
        <div className="text-2xl font-bold text-indigo-600">NotaAI</div>
        {user && (
          <button
            className="flex items-center gap-2 text-sm text-gray-700"
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            aria-label="Open profile"
          >
            <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
              {user.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <span className="hidden sm:inline">Hi, {user.name?.split(" ")[0]}</span>
          </button>
        )}
      </div>

      {/* Center: search */}
      <div className="flex-1 flex justify-center">
        <input
          type="text"
          placeholder="Search notes..."
          onChange={(e) => setQuery(e.target.value)}
          className="w-full max-w-2xl px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm"
        />
      </div>

      {/* Right: filter, calendar, new note */}
      <div className="flex items-center gap-4">
        {/* Filter */}
        <div className="relative" ref={filterRef}>
          <button
            onClick={() => setFilterOpen((s) => !s)}
            className={`p-2 rounded-lg border ${
              currentFilter ? "bg-indigo-50 border-indigo-300" : "border-gray-200"
            } hover:bg-gray-50`}
            aria-label="Filter notes"
          >
            <FaFilter className="text-indigo-600" />
          </button>

          {isFilterOpen && (
            <div className="absolute right-0 mt-2 w-60 bg-white border shadow-lg rounded-md z-50">
              <div className="p-2 text-xs text-gray-500 border-b">Filters</div>
              {filterOptions.map((opt) => (
                <div
                  key={opt.value}
                  className={`px-4 py-2 text-sm cursor-pointer hover:bg-indigo-50 ${
                    currentFilter === opt.value ? "bg-indigo-100 font-medium" : ""
                  }`}
                  onClick={() => {
                    onFilterSelect(opt.value);
                    setFilterOpen(false);
                  }}
                >
                  {opt.label}
                </div>
              ))}
              <div
                className="px-4 py-2 text-sm cursor-pointer hover:bg-indigo-50 text-red-600"
                onClick={() => {
                  onFilterSelect("");
                  setFilterOpen(false);
                }}
              >
                Clear Filter
              </div>
            </div>
          )}
        </div>

        {/* Calendar */}
        <div className="relative" ref={calendarRef}>
          <button
            onClick={() => setCalendarOpen((s) => !s)}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50"
            aria-label="Open calendar"
          >
            <FaCalendarAlt className="text-indigo-600" />
          </button>

          {isCalendarOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border shadow-lg rounded-md z-50 p-3">
              <div className="text-sm text-gray-600 mb-2">Pick a date</div>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedDate(val);
                  onDateSelect(val); // send yyyy-mm-dd up
                  setCalendarOpen(false);
                }}
                className="w-full px-2 py-1 border rounded"
              />
              <button
                className="mt-2 w-full text-sm px-2 py-1 bg-gray-100 rounded"
                onClick={() => {
                  setSelectedDate("");
                  onDateSelect("");
                  setCalendarOpen(false);
                }}
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {/* New Note */}
        <button
          onClick={onNewNoteClick}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700"
        >
          <FaPlus />
          <span className="hidden sm:inline">New Note</span>
        </button>
      </div>
    </motion.nav>
  );
};

export default Navbar;





// import React, { useState } from "react";
// import { useAuth } from "../context/ContextProvider";
// import { motion } from "framer-motion";
// import { FaFilter, FaCalendarAlt } from "react-icons/fa"; // Filter + Calendar
// import { format } from "date-fns";

// const Navbar = ({ setQuery, isSidebarOpen, setSidebarOpen, onFilterSelect, currentFilter }) => {
//   const { user } = useAuth();
//   const [isFilterOpen, setFilterOpen] = useState(false);
//   const [isCalendarOpen, setCalendarOpen] = useState(false);
//   const [selectedDate, setSelectedDate] = useState(new Date());

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
//       <input
//         type="text"
//         placeholder="Search notes..."
//         onChange={(e) => setQuery(e.target.value)}
//         className="px-3 py-1 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 w-1/3 text-center"
//       />

//       {/* Right: Filter + Calendar */}
//       <div className="flex items-center gap-4 relative">
//         {/* Filter */}
//         <div className="relative">
//           <FaFilter
//             size={20}
//             className="cursor-pointer text-gray-700 hover:text-blue-600"
//             onClick={() => setFilterOpen(!isFilterOpen)}
//           />
//           {isFilterOpen && (
//             <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded-md z-50">
//               {filterOptions.map((opt) => (
//                 <div
//                   key={opt.value}
//                   className={`px-4 py-2 cursor-pointer hover:bg-blue-100 ${
//                     currentFilter === opt.value ? "bg-blue-100 font-semibold" : ""
//                   }`}
//                   onClick={() => {
//                     onFilterSelect(opt.value);
//                     setFilterOpen(false);
//                   }}
//                 >
//                   {opt.label}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Calendar */}
//         <div className="relative">
//           <FaCalendarAlt
//             size={20}
//             className="cursor-pointer text-gray-700 hover:text-blue-600"
//             onClick={() => setCalendarOpen(!isCalendarOpen)}
//           />
//           {isCalendarOpen && (
//             <div className="absolute right-0 mt-2 p-2 bg-white border border-gray-200 shadow-lg rounded-md z-50">
//               <input
//                 type="date"
//                 value={format(selectedDate, "yyyy-MM-dd")}
//                 onChange={(e) => setSelectedDate(new Date(e.target.value))}
//                 className="px-2 py-1 border rounded-md"
//               />
//             </div>
//           )}
//         </div>
//       </div>
//     </motion.nav>
//   );
// };

// export default Navbar;