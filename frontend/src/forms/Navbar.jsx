import React, { useState } from "react";
import { useAuth } from "../context/ContextProvider";
import { Link } from "react-router-dom";
import Dashboard from "./Dashboard";

const Navbar = ({ setQuery }) => {
  const { user } = useAuth();
  const [isDashboardOpen, setDashboardOpen] = useState(false);

  return (
    <>
      <nav className="flex justify-between items-center px-8 py-4 shadow-lg bg-white">
        {/* Left side: Avatar + Welcome message */}
        {user ? (
          <div className="flex items-center gap-3">
            <div
              onClick={() => setDashboardOpen(true)}
              className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center cursor-pointer font-bold"
              title="Open Dashboard"
            >
              {user.name ? user.name[0].toUpperCase() : "U"}
            </div>
            <span className="text-gray-800 font-medium">
              Welcome, {user.name ? user.name.split(" ")[0] : "User"}
            </span>
          </div>
        ) : (
          <Link to="/" className="text-2xl font-bold text-blue-600">
            Notes App
          </Link>
        )}

        {/* Search bar for logged-in users */}
        {user && (
          <input
            type="text"
            placeholder="Search notes..."
            onChange={(e) => setQuery(e.target.value)}
            className="px-3 py-1 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 w-64"
          />
        )}

        {/* Non-logged-in users */}
        {!user && (
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="text-gray-700 font-medium hover:text-blue-600 transition"
            >
              Signup
            </Link>
          </div>
        )}
      </nav>

      {/* Dashboard Sidebar */}
      {user && (
        <Dashboard
          isOpen={isDashboardOpen}
          onClose={() => setDashboardOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;




// import React, { useState } from "react";
// import { useAuth } from "../context/ContextProvider";
// import { motion } from "framer-motion";
// import { Link } from "react-router-dom";
// import Dashboard from "./Dashboard";

// const Navbar = ({ setQuery }) => {
//   const { user } = useAuth();
//   const [isDashboardOpen, setDashboardOpen] = useState(false);

//   return (
//     <>
//       <motion.nav
//         className="flex justify-between items-center px-8 py-4 shadow-lg bg-white"
//         initial={{ y: -50, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ duration: 0.5 }}
//       >
//         {/* User avatar/logo on left */}
//         {user ? (
//           <div
//             onClick={() => setDashboardOpen(true)}
//             className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center cursor-pointer font-bold"
//             title="Open Dashboard"
//           >
//             {user.name ? user.name[0].toUpperCase() : "U"}
//           </div>
//         ) : (
//           <Link to="/" className="text-2xl font-bold text-blue-600">
//             Notes App
//           </Link>
//         )}

//         {/* Search input (for logged-in user) */}
//         {user && (
//           <input
//             type="text"
//             placeholder="Search notes..."
//             onChange={(e) => setQuery(e.target.value)}
//             className="px-3 py-1 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 w-64"
//           />
//         )}

//         {/* Signup/Login links for non-logged-in users */}
//         {!user && (
//           <div className="flex items-center gap-4">
//             <Link
//               to="/login"
//               className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
//             >
//               Login
//             </Link>
//             <Link
//               to="/signup"
//               className="text-gray-700 font-medium hover:text-blue-600 transition"
//             >
//               Signup
//             </Link>
//           </div>
//         )}
//       </motion.nav>

//       {/* Dashboard Sidebar */}
//       {user && (
//         <Dashboard
//           isOpen={isDashboardOpen}
//           onClose={() => setDashboardOpen(false)}
//         />
//       )}
//     </>
//   );
// };

// export default Navbar;
