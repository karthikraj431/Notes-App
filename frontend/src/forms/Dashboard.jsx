import React, { useEffect, useState } from "react";
import { useAuth } from "../context/ContextProvider";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "./Navbar";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [notes, setNotes] = useState([]);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchNotes();
  }, []);

  // Fetch user notes
  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const { data } = await axios.get(`${API_URL}/api/note`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) setNotes(data.notes);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch notes");
    }
  };

  // Update password
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.put(
        `${API_URL}/api/auth/update-password`,
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        toast.success("Password updated successfully!");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Password update failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto p-6">
        <h2 className="text-3xl font-bold mb-6">Dashboard</h2>

        {/* Profile Section */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h3 className="text-2xl font-semibold mb-4">Profile</h3>
          <p><strong>Name:</strong> {user?.name}</p>
          <p><strong>Email:</strong> {user?.email}</p>
        </div>

        {/* Update Password */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h3 className="text-2xl font-semibold mb-4">Update Password</h3>
          <form onSubmit={handlePasswordUpdate} className="flex flex-col gap-4">
            <input
              type="password"
              placeholder="Old Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="p-2 border rounded"
              required
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="p-2 border rounded"
              required
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="p-2 border rounded"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
            >
              Update Password
            </button>
          </form>
        </div>

        {/* Recent Notes */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h3 className="text-2xl font-semibold mb-4">Recent Notes</h3>
          {notes.length > 0 ? (
            <ul className="list-disc pl-5">
              {notes.map((note) => (
                <li key={note._id} className="mb-2">
                  <strong>{note.title}</strong> - {new Date(note.createdAt).toLocaleDateString()}
                </li>
              ))}
            </ul>
          ) : (
            <p>No notes found</p>
          )}
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
