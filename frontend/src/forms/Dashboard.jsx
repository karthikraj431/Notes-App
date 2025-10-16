import React, { useState, useEffect } from "react";
import { useAuth } from "../context/ContextProvider";
import axios from "axios";
import { toast } from "react-toastify";

const Sidebar = ({ isOpen, closeSidebar }) => {
  const { user, logout } = useAuth();
  const [notes, setNotes] = useState([]);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [canChange, setCanChange] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (user) fetchNotes();
  }, [user]);

  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${API_URL}/api/note`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) setNotes(data.notes);
    } catch (error) {
      console.log(error);
    }
  };

  const verifyCurrentPassword = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        `${API_URL}/api/auth/verify-password`,
        { password: currentPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        toast.success("Password verified, you can change it now.");
        setCanChange(true);
      } else {
        toast.error("Current password is incorrect.");
        setCanChange(false);
      }
    } catch (error) {
      toast.error("Verification failed.");
      setCanChange(false);
    }
  };

  const handleChangePassword = async () => {
    if (!canChange) return toast.error("Verify current password first.");
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.put(
        `${API_URL}/api/auth/update-password`,
        { newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        toast.success("Password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setCanChange(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update password");
    }
  };

  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg p-6 transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <h2 className="text-xl font-bold mb-4">Profile</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>

      <hr className="my-4" />
      <h3 className="font-semibold mb-2">Update Password</h3>
      <input
        type="password"
        placeholder="Current Password"
        className="w-full p-2 border rounded mb-2"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
      />
      <button
        onClick={verifyCurrentPassword}
        className="w-full bg-blue-600 text-white py-2 rounded mb-2 hover:bg-blue-700"
      >
        Verify Current Password
      </button>
      <input
        type="password"
        placeholder="New Password"
        className="w-full p-2 border rounded mb-2"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        disabled={!canChange}
      />
      <button
        onClick={handleChangePassword}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        disabled={!canChange}
      >
        Change Password
      </button>

      <hr className="my-4" />
      <h3 className="font-semibold mb-2">Recent Notes</h3>
      <ul className="list-disc list-inside max-h-64 overflow-y-auto">
        {notes.map((note) => (
          <li key={note._id}>{note.title}</li>
        ))}
      </ul>

      <button
        onClick={logout}
        className="mt-4 w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
};

export default Sidebar;




// import React, { useState, useEffect } from "react";
// import { useAuth } from "../context/ContextProvider";
// import axios from "axios";
// import { toast } from "react-toastify";

// const Dashboard = ({ isOpen, onClose }) => {
//   const { user, logout } = useAuth();
//   const [recentNotes, setRecentNotes] = useState([]);
//   const [password, setPassword] = useState("");
//   const API_URL = import.meta.env.VITE_API_URL;

//   useEffect(() => {
//     if (user && isOpen) fetchRecentNotes();
//   }, [user, isOpen]);

//   const fetchRecentNotes = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const { data } = await axios.get(`${API_URL}/api/note`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (data.success) {
//         setRecentNotes(data.notes.slice(-5).reverse()); // last 5 notes
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to fetch recent notes");
//     }
//   };

//   const handlePasswordUpdate = async () => {
//     try {
//       if (password.length < 8) {
//         toast.error("Password must be at least 8 characters");
//         return;
//       }
//       const token = localStorage.getItem("token");
//       const { data } = await axios.put(
//         `${API_URL}/api/auth/update-password`,
//         { password },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       if (data.success) {
//         toast.success("Password updated successfully!");
//         setPassword("");
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error(error.response?.data?.message || "Failed to update password");
//     }
//   };

//   return (
//     <div
//       className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
//         isOpen ? "translate-x-0" : "-translate-x-full"
//       }`}
//     >
//       <div className="p-4 flex justify-between items-center border-b">
//         <h2 className="font-bold text-lg">Dashboard</h2>
//         <button onClick={onClose} className="text-red-500 font-bold">
//           X
//         </button>
//       </div>

//       <div className="p-4 space-y-4">
//         <div>
//           <h3 className="font-semibold">Profile</h3>
//           <p>Name: {user?.name}</p>
//           <p>Email: {user?.email}</p>
//         </div>

//         <div>
//           <h3 className="font-semibold">Update Password</h3>
//           <input
//             type="password"
//             placeholder="New Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="w-full p-2 border rounded mb-2"
//           />
//           <button
//             onClick={handlePasswordUpdate}
//             className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
//           >
//             Update
//           </button>
//         </div>

//         <div>
//           <h3 className="font-semibold">Recent Notes</h3>
//           <ul className="list-disc ml-4 space-y-1 max-h-48 overflow-y-auto">
//             {recentNotes.length > 0 ? (
//               recentNotes.map((note) => (
//                 <li key={note._id}>{note.title}</li>
//               ))
//             ) : (
//               <p className="text-gray-500 text-sm">No recent notes</p>
//             )}
//           </ul>
//         </div>

//         <button
//           onClick={logout}
//           className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
//         >
//           Logout
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;






// // import React, { useEffect, useState } from "react";
// // import { useAuth } from "../context/ContextProvider";
// // import axios from "axios";
// // import { toast } from "react-toastify";
// // import Navbar from "./Navbar";

// // const Dashboard = () => {
// //   const { user, logout } = useAuth();
// //   const [notes, setNotes] = useState([]);
// //   const [oldPassword, setOldPassword] = useState("");
// //   const [newPassword, setNewPassword] = useState("");
// //   const [confirmPassword, setConfirmPassword] = useState("");
// //   const API_URL = import.meta.env.VITE_API_URL;

// //   useEffect(() => {
// //     fetchNotes();
// //   }, []);

// //   // Fetch user notes
// //   const fetchNotes = async () => {
// //     try {
// //       const token = localStorage.getItem("token");
// //       if (!token) return;

// //       const { data } = await axios.get(`${API_URL}/api/note`, {
// //         headers: { Authorization: `Bearer ${token}` },
// //       });
// //       if (data.success) setNotes(data.notes);
// //     } catch (error) {
// //       console.error(error);
// //       toast.error("Failed to fetch notes");
// //     }
// //   };

// //   // Update password
// //   const handlePasswordUpdate = async (e) => {
// //     e.preventDefault();
// //     if (newPassword !== confirmPassword) {
// //       toast.error("New password and confirm password do not match");
// //       return;
// //     }
// //     try {
// //       const token = localStorage.getItem("token");
// //       const { data } = await axios.put(
// //         `${API_URL}/api/auth/update-password`,
// //         { oldPassword, newPassword },
// //         { headers: { Authorization: `Bearer ${token}` } }
// //       );
// //       if (data.success) {
// //         toast.success("Password updated successfully!");
// //         setOldPassword("");
// //         setNewPassword("");
// //         setConfirmPassword("");
// //       } else {
// //         toast.error(data.message);
// //       }
// //     } catch (error) {
// //       console.error(error);
// //       toast.error(error.response?.data?.message || "Password update failed");
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-gray-50">
// //       <Navbar />
// //       <div className="max-w-5xl mx-auto p-6">
// //         <h2 className="text-3xl font-bold mb-6">Dashboard</h2>

// //         {/* Profile Section */}
// //         <div className="bg-white p-6 rounded-lg shadow mb-6">
// //           <h3 className="text-2xl font-semibold mb-4">Profile</h3>
// //           <p><strong>Name:</strong> {user?.name}</p>
// //           <p><strong>Email:</strong> {user?.email}</p>
// //         </div>

// //         {/* Update Password */}
// //         <div className="bg-white p-6 rounded-lg shadow mb-6">
// //           <h3 className="text-2xl font-semibold mb-4">Update Password</h3>
// //           <form onSubmit={handlePasswordUpdate} className="flex flex-col gap-4">
// //             <input
// //               type="password"
// //               placeholder="Old Password"
// //               value={oldPassword}
// //               onChange={(e) => setOldPassword(e.target.value)}
// //               className="p-2 border rounded"
// //               required
// //             />
// //             <input
// //               type="password"
// //               placeholder="New Password"
// //               value={newPassword}
// //               onChange={(e) => setNewPassword(e.target.value)}
// //               className="p-2 border rounded"
// //               required
// //             />
// //             <input
// //               type="password"
// //               placeholder="Confirm New Password"
// //               value={confirmPassword}
// //               onChange={(e) => setConfirmPassword(e.target.value)}
// //               className="p-2 border rounded"
// //               required
// //             />
// //             <button
// //               type="submit"
// //               className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
// //             >
// //               Update Password
// //             </button>
// //           </form>
// //         </div>

// //         {/* Recent Notes */}
// //         <div className="bg-white p-6 rounded-lg shadow mb-6">
// //           <h3 className="text-2xl font-semibold mb-4">Recent Notes</h3>
// //           {notes.length > 0 ? (
// //             <ul className="list-disc pl-5">
// //               {notes.map((note) => (
// //                 <li key={note._id} className="mb-2">
// //                   <strong>{note.title}</strong> - {new Date(note.createdAt).toLocaleDateString()}
// //                 </li>
// //               ))}
// //             </ul>
// //           ) : (
// //             <p>No notes found</p>
// //           )}
// //         </div>

// //         {/* Logout Button */}
// //         <button
// //           onClick={logout}
// //           className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition"
// //         >
// //           Logout
// //         </button>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Dashboard;
