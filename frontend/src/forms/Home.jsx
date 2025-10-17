import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import NoteModal from "./NoteModal";
import Card from "./Card";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../context/ContextProvider";
import { Link } from "react-router-dom";

const Home = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;

  // ✅ Fetch notes on login
  useEffect(() => {
    if (user) fetchNotes();
    else {
      setNotes([]);
      setFilteredNotes([]);
    }
    // eslint-disable-next-line
  }, [user]);

  // ✅ Re-filter whenever filters/search change
  useEffect(() => {
    applySearchFilter();
    // eslint-disable-next-line
  }, [notes, query, filter, dateFilter]);

  // ✅ Fetch all notes
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

  // ✅ Apply filters and search
  const applySearchFilter = () => {
    let temp = [...notes];

    // Filter by date
    if (dateFilter) {
      temp = temp.filter((n) => {
        const created = new Date(n.createdAt);
        const yyyy = created.getFullYear();
        const mm = String(created.getMonth() + 1).padStart(2, "0");
        const dd = String(created.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}` === dateFilter;
      });
    }

    // Filter by query
    if (query) {
      const q = query.toLowerCase();
      temp = temp.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.description.toLowerCase().includes(q)
      );
    }

    // Filter by status/sort
    switch (filter) {
      case "completed":
        temp = temp.filter((n) => n.completed);
        break;
      case "incomplete":
        temp = temp.filter((n) => !n.completed);
        break;
      case "dateAsc":
        temp.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "dateDesc":
        temp.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        break;
    }

    setFilteredNotes(temp);
  };

  // ✅ CRUD actions
  const addNote = async (title, description) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const { data } = await axios.post(
        `${API_URL}/api/note/add`,
        { title, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        fetchNotes();
        setModalOpen(false);
        toast.success("Note added successfully!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add note");
    }
  };

  const editNote = async (id, title, description) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.put(
        `${API_URL}/api/note/${id}`,
        { title, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        fetchNotes();
        setModalOpen(false);
        toast.success("Note updated successfully!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to edit note");
    }
  };

  const deleteNote = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.delete(`${API_URL}/api/note/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        toast.success("Note deleted successfully!");
        fetchNotes();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete note");
    }
  };

  const toggleCompletion = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.put(
        `${API_URL}/api/note/toggle/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        setNotes((prev) =>
          prev.map((n) => (n._id === id ? data.note : n))
        );
        toast.success(
          `Note marked as ${data.note.completed ? "Completed" : "Not Completed"}`
        );
      }
    } catch (error) {
      toast.error("Failed to update note status");
    }
  };

  // ✅ Note modal controls
  const handleNewNoteClick = () => {
    setCurrentNote(null);
    setModalOpen(true);
  };
  const onEdit = (note) => {
    setCurrentNote(note);
    setModalOpen(true);
  };
  const closeModal = () => {
    setCurrentNote(null);
    setModalOpen(false);
  };

  // ✅ Group notes for UI
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayNotes = filteredNotes.filter(
    (n) => new Date(n.createdAt) >= startOfToday
  );
  const comingUpNotes = filteredNotes
    .filter((n) => new Date(n.createdAt) < startOfToday)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  // ✅ If not logged in
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
        <nav className="w-full bg-white shadow-md py-4 px-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">NOTES</h1>
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-gray-700 font-medium hover:text-indigo-600 transition"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
            >
              Signup
            </Link>
          </div>
        </nav>

        <main className="flex-1 flex items-center justify-center px-8 py-20">
          <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-4xl font-extrabold text-gray-800 mb-4">
                “Capture your thoughts, shape your ideas, and never lose a note again.”
              </h2>
              <p className="text-gray-600">
                A simple, elegant place to keep your ideas organized.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow p-10 flex flex-col items-center justify-center">
              <h3 className="text-2xl font-semibold mb-4">Get started</h3>
              <p className="text-gray-600 text-center mb-6">
                Sign up to create, edit and manage personal notes.
              </p>
              <Link
                to="/signup"
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ✅ Logged-in dashboard UI
  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col">
        <div className="px-6 py-6 border-b">
          <h1 className="text-2xl font-bold text-indigo-600">NOTES</h1>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          <h2 className="text-sm font-semibold text-gray-500 mb-3">My Notes</h2>
          <div className="space-y-2">
            {notes.length > 0 ? (
              notes.map((note) => (
                <button
                  key={note._id}
                  onClick={() => onEdit(note)}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-indigo-50 transition"
                >
                  <p className="font-medium text-gray-700 truncate">{note.title}</p>
                </button>
              ))
            ) : (
              <p className="text-gray-400 text-sm">No notes yet</p>
            )}
          </div>
        </div>

        {/* Bottom options */}
        <div className="border-t px-4 py-4 space-y-3">
          <button
            onClick={() => toast.info("Password reset popup here")}
            className="w-full flex items-center justify-between px-3 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition"
          >
            Reset Password
            <span>🔒</span>
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/";
            }}
            className="w-full flex items-center justify-between px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
          >
            Logout
            <span>🚪</span>
          </button>
        </div>
      </aside>

      {/* Main Section */}
      <div className="flex-1 flex flex-col">
        <Navbar
          setQuery={setQuery}
          onFilterSelect={(v) => setFilter(v)}
          currentFilter={filter}
          onDateSelect={(val) => setDateFilter(val)}
          onNewNoteClick={handleNewNoteClick}
        />

        <main className="flex-1 px-8 py-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            {/* <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold">Dashboard</h1>
                <p className="text-gray-500 text-sm">
                  Welcome back — here’s your workspace.
                </p>
              </div>
              <button
                onClick={handleNewNoteClick}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                + New Note
              </button>
            </div> */}

            {/* Coming Up */}
            <section>
              <h2 className="text-lg font-semibold text-gray-700 mb-3">Coming up</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {comingUpNotes.length > 0 ? (
                  comingUpNotes.map((note) => (
                    <div
                      key={note._id}
                      className="bg-white border rounded-xl p-4 flex items-start gap-3 shadow-sm hover:shadow-md transition"
                    >
                      <div className="w-10 h-10 bg-indigo-50 text-indigo-600 flex items-center justify-center rounded-lg">
                        📅
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium text-gray-800 truncate">
                            {note.title}
                          </h3>
                          <span className="text-xs text-gray-400">
                            {new Date(note.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {note.description}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400">No upcoming notes</p>
                )}
              </div>
            </section>

            {/* Today */}
            <section>
              <h2 className="text-lg font-semibold text-gray-700 mb-3">Today</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {todayNotes.length > 0 ? (
                  todayNotes.map((note) => (
                    <Card
                      key={note._id}
                      note={note}
                      onEdit={onEdit}
                      deleteNote={deleteNote}
                      toggleCompletion={toggleCompletion}
                    />
                  ))
                ) : (
                  <p className="text-gray-400">No notes for today</p>
                )}
              </div>
            </section>
          </div>
        </main>
      </div>

      {isModalOpen && (
        <NoteModal
          closeModal={closeModal}
          addNote={addNote}
          currentNote={currentNote}
          editNote={editNote}
        />
      )}
    </div>
  );
};

export default Home;
