import React from "react";
import { useAuth } from "../context/ContextProvider";
import { motion } from "framer-motion";
import { FaCalendarAlt } from "react-icons/fa";

const Navbar = ({ setQuery, isSidebarOpen, setSidebarOpen, filter, setFilter }) => {
  const { user } = useAuth();

  // Get current date
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <motion.nav
      className="flex justify-between items-center px-8 py-4 shadow-lg bg-white"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-3">
        {/* User Avatar */}
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

      <div className="flex items-center gap-4">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search notes..."
          onChange={(e) => setQuery(e.target.value)}
          className="px-3 py-1 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Filter Dropdown */}
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border px-3 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">All Notes</option>
          <option value="completed">Completed Work</option>
          <option value="incomplete">Incomplete Work</option>
          <option value="dateAsc">Date Uploaded (Ascending)</option>
          <option value="dateDesc">Date Uploaded (Descending)</option>
        </select>

        {/* Calendar Icon with Date */}
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

// const Navbar = ({ setQuery, isSidebarOpen, setSidebarOpen, filter, setFilter }) => {
//   const { user } = useAuth();

//   return (
//     <motion.nav
//       className="flex justify-between items-center px-8 py-4 shadow-lg bg-white"
//       initial={{ y: -50, opacity: 0 }}
//       animate={{ y: 0, opacity: 1 }}
//       transition={{ duration: 0.5 }}
//     >
//       <div className="flex items-center gap-3">
//         {/* User Avatar */}
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

//       <div className="flex items-center gap-4">
//         {/* Search Input */}
//         <input
//           type="text"
//           placeholder="Search notes..."
//           onChange={(e) => setQuery(e.target.value)}
//           className="px-3 py-1 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
//         />

//         {/* Filter Dropdown */}
//         <select
//           value={filter}
//           onChange={(e) => setFilter(e.target.value)}
//           className="border px-3 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//         >
//           <option value="">All Notes</option>
//           <option value="completed">Completed Work</option>
//           <option value="incomplete">Incomplete Work</option>
//           <option value="dateAsc">Date Uploaded (Ascending)</option>
//           <option value="dateDesc">Date Uploaded (Descending)</option>
//         </select>
//       </div>
//     </motion.nav>
//   );
// };

// export default Navbar;