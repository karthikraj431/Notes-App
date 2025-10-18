import React, { useState } from "react";
import { useAuth } from "../context/ContextProvider";
import axios from "axios";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Sidebar = ({ isOpen, closeSidebar }) => {
  const { user, logout } = useAuth();
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
        logout(); // force re-login
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update password");
    }
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-white w-72 p-6 border-r transition-transform z-30 ${
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Profile</h3>
        <p className="text-sm text-gray-600 mt-2">Hello, {user.name}</p>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Previous password</label>
        <div className="relative">
          <input
            type={showPrevPassword ? "text" : "password"}
            value={prevPassword}
            onChange={(e) => setPrevPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
          <button
            className="absolute right-2 top-2 text-gray-500"
            onClick={() => setShowPrevPassword((s) => !s)}
            type="button"
          >
            {showPrevPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">New password</label>
        <div className="relative">
          <input
            type={showNewPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
          <button
            className="absolute right-2 top-2 text-gray-500"
            onClick={() => setShowNewPassword((s) => !s)}
            type="button"
          >
            {showNewPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
      </div>

      <button onClick={handleChangePassword} className="w-full bg-indigo-600 text-white py-2 rounded mb-3">
        Update password
      </button>

      <button onClick={logout} className="w-full bg-red-600 text-white py-2 rounded">
        Logout
      </button>

      <button onClick={closeSidebar} className="absolute top-4 right-4 text-gray-500">
        ✕
      </button>
    </aside>
  );
};

export default Sidebar;
