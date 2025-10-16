import React from "react";
import { useAuth } from "../context/ContextProvider";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Navbar = ({ setQuery }) => {
  const { user, logout } = useAuth();

  return (
    <motion.nav
      className="flex justify-between items-center px-8 py-4 shadow-lg bg-white"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Link to="/" className="text-2xl font-bold text-blue-600">
        {user ? (
          <span>
            {user.name
              ? `${user.name.split(" ")[0]}, welcome to Notes App`
              : "Welcome to Notes App"}
          </span>
        ) : (
          "Notes App"
        )}
      </Link>

      {user ? (
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search notes..."
            onChange={(e) => setQuery(e.target.value)}
            className="px-3 py-1 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      ) : (
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
    </motion.nav>
  );
};

export default Navbar;




// import React from "react";
// import { useAuth } from "../context/ContextProvider";
// import { motion } from "framer-motion";
// import { Link } from "react-router-dom";

// const Navbar = ({ setQuery }) => {
//   const { user, logout } = useAuth();

//   return (
//     <motion.nav
//       className="flex justify-between items-center px-8 py-4 shadow-lg bg-white"
//       initial={{ y: -50, opacity: 0 }}
//       animate={{ y: 0, opacity: 1 }}
//       transition={{ duration: 0.5 }}
//     >
//       <Link to="/" className="text-2xl font-bold text-blue-600">
//         Notes App
//       </Link>

//       {user ? (
//         <div className="flex items-center gap-4">
//           <input
//             type="text"
//             placeholder="Search notes..."
//             onChange={(e) => setQuery(e.target.value)}
//             className="px-3 py-1 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
//           />
//           <button
//             onClick={logout}
//             className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
//           >
//             Logout
//           </button>
//         </div>
//       ) : (
//         <div className="flex items-center gap-4">
//           <Link
//             to="/login"
//             className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
//           >
//             Login
//           </Link>
//           <Link
//             to="/signup"
//             className="text-gray-700 font-medium hover:text-blue-600 transition"
//           >
//             Signup
//           </Link>
//         </div>
//       )}
//     </motion.nav>
//   );
// };

// export default Navbar;