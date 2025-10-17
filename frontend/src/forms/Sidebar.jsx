import React, { useState } from "react";
import { useAuth } from "../context/ContextProvider";
import axios from "axios";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Sidebar = ({ isOpen, closeSidebar }) => {
  const { user, setUser, logout } = useAuth();
  const [prevPassword, setPrevPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPrevPassword, setShowPrevPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  const handleChangePassword = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        `${API_URL}/api/auth/change-password`,
        { prevPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        toast.success("Password updated successfully!");
        setPrevPassword("");
        setNewPassword("");
        closeSidebar();
        logout(); // force login again
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update password");
    }
  };

  return (
    <div
      className={`fixed top-0 left-0 h-full bg-white shadow-lg w-64 p-6 transform transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <h2 className="text-xl font-semibold mb-4">Profile</h2>
      <p className="mb-4">Hello, {user.name}</p>

      {/* Previous Password */}
      <div className="mb-4 relative">
        <label className="block mb-1 font-medium">Previous Password</label>
        <input
          type={showPrevPassword ? "text" : "password"}
          value={prevPassword}
          onChange={(e) => setPrevPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
        />
        <span
          className="absolute top-9 right-3 cursor-pointer text-gray-500"
          onClick={() => setShowPrevPassword(!showPrevPassword)}
        >
          {showPrevPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>

      {/* New Password */}
      <div className="mb-4 relative">
        <label className="block mb-1 font-medium">New Password</label>
        <input
          type={showNewPassword ? "text" : "password"}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
        />
        <span
          className="absolute top-9 right-3 cursor-pointer text-gray-500"
          onClick={() => setShowNewPassword(!showNewPassword)}
        >
          {showNewPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>

      <button
        onClick={handleChangePassword}
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
      >
        Update Password
      </button>

      <button
        onClick={logout}
        className="w-full mt-4 bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition"
      >
        Logout
      </button>

      <button
        onClick={closeSidebar}
        className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
      >
        ✕
      </button>
    </div>
  );
};

export default Sidebar;





// import React, { useState } from "react";
// import { useAuth } from "../context/ContextProvider";
// import axios from "axios";
// import { toast } from "react-toastify";

// const Sidebar = ({ isOpen, closeSidebar }) => {
//   const { user, setUser, logout } = useAuth();
//   const [prevPassword, setPrevPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const API_URL = import.meta.env.VITE_API_URL;

//   const handleChangePassword = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const { data } = await axios.post(
//         `${API_URL}/api/auth/change-password`,
//         { prevPassword, newPassword },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       if (data.success) {
//         toast.success("Password updated successfully!");
//         setPrevPassword("");
//         setNewPassword("");
//         closeSidebar();
//         logout(); // force login again
//       } else {
//         toast.error(data.message);
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error(err.response?.data?.message || "Failed to update password");
//     }
//   };

//   return (
//     <div
//       className={`fixed top-0 left-0 h-full bg-white shadow-lg w-64 p-6 transform transition-transform duration-300 ${
//         isOpen ? "translate-x-0" : "-translate-x-full"
//       }`}
//     >
//       <h2 className="text-xl font-semibold mb-4">Profile</h2>
//       <p className="mb-4">Hello, {user.name}</p>

//       <div className="mb-4">
//         <label className="block mb-1 font-medium">Previous Password</label>
//         <input
//           type="password"
//           value={prevPassword}
//           onChange={(e) => setPrevPassword(e.target.value)}
//           className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//         />
//       </div>

//       <div className="mb-4">
//         <label className="block mb-1 font-medium">New Password</label>
//         <input
//           type="password"
//           value={newPassword}
//           onChange={(e) => setNewPassword(e.target.value)}
//           className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//         />
//       </div>

//       <button
//         onClick={handleChangePassword}
//         className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
//       >
//         Update Password
//       </button>

//       <button
//         onClick={logout}
//         className="w-full mt-4 bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition"
//       >
//         Logout
//       </button>

//       <button
//         onClick={closeSidebar}
//         className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
//       >
//         ✕
//       </button>
//     </div>
//   );
// };

// export default Sidebar;
