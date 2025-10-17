import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/ContextProvider";
import NoteModal from "./NoteModal";
import PasswordresetModal from "./PasswordresetModal";
import { CalendarDays, LogOut, Lock, PlusCircle, Filter } from "lucide-react";
import { toast } from "react-toastify";

const Home = () => {
  const { user, logout } = useAuth();
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/notes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (data.success) setNotes(data.notes);
      } catch (err) {
        toast.error("Error loading notes");
      }
    };
    fetchNotes();
  }, []);

  const filteredNotes = notes.filter((n) =>
    n.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col justify-between">
        <div>
          <div className="p-6 font-bold text-2xl text-indigo-600">NotaAI</div>
          <div className="px-4 text-sm text-gray-500 mb-2">My Notes</div>
          <div className="overflow-y-auto h-[65vh] px-2 space-y-2">
            {notes.length ? (
              notes.map((note) => (
                <div
                  key={note._id}
                  className="p-3 rounded-md text-gray-700 hover:bg-indigo-100 cursor-pointer truncate"
                >
                  {note.title}
                </div>
              ))
            ) : (
              <p className="px-2 text-gray-400 text-sm">No notes yet</p>
            )}
          </div>
        </div>

        <div className="p-4 border-t space-y-3 text-sm text-gray-700">
          <button
            onClick={() => setShowResetModal(true)}
            className="flex items-center gap-2 w-full hover:text-indigo-600"
          >
            <Lock size={16} /> Reset Password
          </button>
          <button
            onClick={() => {
              logout();
              toast.success("Logged out");
            }}
            className="flex items-center gap-2 w-full text-red-600 hover:text-red-700"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main section */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <header className="flex items-center justify-between p-4 bg-white border-b shadow-sm">
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded-lg px-4 py-2 w-80 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Filter size={20} />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <CalendarDays size={20} />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowNoteModal(true)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
            >
              <PlusCircle size={18} /> New Note
            </button>

            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <span className="text-gray-700 text-sm">Hi, {user?.name}</span>
            </div>
          </div>
        </header>

        {/* Notes Grid */}
        <main className="flex-1 p-6 overflow-y-auto">
          <h2 className="text-gray-600 mb-4 text-sm">
            Welcome back — here’s your workspace
          </h2>

          {filteredNotes.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredNotes.map((note) => (
                <div
                  key={note._id}
                  className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-gray-800 truncate">
                      {note.title}
                    </h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-md ${
                        note.status === "Completed"
                          ? "bg-green-100 text-green-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {note.status || "Progress"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    {note.content || "No details"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(note.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No notes found</p>
          )}
        </main>
      </div>

      {showNoteModal && <NoteModal onClose={() => setShowNoteModal(false)} />}
      {showResetModal && <PasswordresetModal onClose={() => setShowResetModal(false)} />}
    </div>
  );
};

export default Home;




// import React, { useEffect, useState } from "react";
// import Navbar from "./Navbar";
// import NoteModal from "./NoteModal";
// import Card from "./Card";
// import Sidebar from "./Sidebar";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { useAuth } from "../context/ContextProvider";
// import { Link } from "react-router-dom";

// const Home = () => {
//   const { user } = useAuth();
//   const [notes, setNotes] = useState([]);
//   const [filteredNotes, setFilteredNotes] = useState([]);
//   const [isModalOpen, setModalOpen] = useState(false);
//   const [currentNote, setCurrentNote] = useState(null);
//   const [query, setQuery] = useState("");
//   const [filter, setFilter] = useState("");
//   const [isSidebarOpen, setSidebarOpen] = useState(false);
//   const [dateFilter, setDateFilter] = useState(""); // yyyy-mm-dd
//   const API_URL = import.meta.env.VITE_API_URL;

//   useEffect(() => {
//     if (user) fetchNotes();
//     else {
//       setNotes([]);
//       setFilteredNotes([]);
//     }
//     // eslint-disable-next-line
//   }, [user]);

//   useEffect(() => {
//     applySearchFilter();
//     // eslint-disable-next-line
//   }, [notes, query, filter, dateFilter]);

//   const fetchNotes = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) return;
//       const { data } = await axios.get(`${API_URL}/api/note`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (data.success) setNotes(data.notes);
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to fetch notes");
//     }
//   };

//   const applySearchFilter = () => {
//     let temp = [...notes];

//     // If dateFilter present, show notes created on that date
//     if (dateFilter) {
//       temp = temp.filter((n) => {
//         const created = new Date(n.createdAt);
//         const yyyy = created.getFullYear();
//         const mm = String(created.getMonth() + 1).padStart(2, "0");
//         const dd = String(created.getDate()).padStart(2, "0");
//         return `${yyyy}-${mm}-${dd}` === dateFilter;
//       });
//     }

//     if (query) {
//       const q = query.toLowerCase();
//       temp = temp.filter(
//         (n) =>
//           n.title.toLowerCase().includes(q) || n.description.toLowerCase().includes(q)
//       );
//     }

//     switch (filter) {
//       case "completed":
//         temp = temp.filter((n) => n.completed);
//         break;
//       case "incomplete":
//         temp = temp.filter((n) => !n.completed);
//         break;
//       case "dateAsc":
//         temp.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
//         break;
//       case "dateDesc":
//         temp.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//         break;
//       default:
//         break;
//     }

//     setFilteredNotes(temp);
//   };

//   const addNote = async (title, description) => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) return;
//       const { data } = await axios.post(
//         `${API_URL}/api/note/add`,
//         { title, description },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       if (data.success) {
//         fetchNotes();
//         setModalOpen(false);
//         toast.success("Note added successfully!");
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error(error.response?.data?.message || "Failed to add note");
//     }
//   };

//   const editNote = async (id, title, description) => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) return toast.error("No token found, please login");
//       const { data } = await axios.put(
//         `${API_URL}/api/note/${id}`,
//         { title, description },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       if (data.success) {
//         fetchNotes();
//         setModalOpen(false);
//         toast.success("Note updated successfully!");
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error(error.response?.data?.message || "Failed to edit note");
//     }
//   };

//   const deleteNote = async (id) => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) return toast.error("No token found, please login");
//       const { data } = await axios.delete(`${API_URL}/api/note/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (data.success) {
//         toast.success("Note deleted successfully!");
//         fetchNotes();
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error(error.response?.data?.message || "Failed to delete note");
//     }
//   };

//   const toggleCompletion = async (id) => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) return;
//       const { data } = await axios.put(
//         `${API_URL}/api/note/toggle/${id}`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       if (data.success) {
//         setNotes((prev) => prev.map((n) => (n._id === id ? data.note : n)));
//         toast.success(
//           `Note marked as ${data.note.completed ? "Completed" : "Not Completed"}`
//         );
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to update note status");
//     }
//   };

//   // New note button in navbar
//   const handleNewNoteClick = () => {
//     setCurrentNote(null);
//     setModalOpen(true);
//   };

//   const onEdit = (note) => {
//     setCurrentNote(note);
//     setModalOpen(true);
//   };
//   const closeModal = () => {
//     setCurrentNote(null);
//     setModalOpen(false);
//   };

//   // group notes for UI: Coming up (next 5 newest), Today (created today)
//   const now = new Date();
//   const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
//   const todayNotes = filteredNotes.filter((n) => new Date(n.createdAt) >= startOfToday);
//   // Coming up: the most recent 5 notes that are NOT created today (or simply first 5 of filteredNotes)
//   const comingUpNotes = filteredNotes
//     .filter((n) => new Date(n.createdAt) < startOfToday)
//     .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
//     .slice(0, 5);

//   // If not logged in show hero (already in original)
//   if (!user) {
//     return (
//       <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
//         <nav className="w-full bg-white shadow-md py-4 px-6 flex justify-between items-center">
//           <h1 className="text-2xl font-bold text-indigo-600">NotaAI</h1>
//           <div className="flex items-center gap-4">
//             <Link to="/login" className="text-gray-700 font-medium hover:text-indigo-600 transition">
//               Login
//             </Link>
//             <Link to="/signup" className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition">
//               Signup
//             </Link>
//           </div>
//         </nav>

//         <main className="flex-1 flex items-center justify-center px-8 py-20">
//           <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
//             <div>
//               <h2 className="text-4xl font-extrabold text-gray-800 mb-4">
//                 “Capture your thoughts, shape your ideas, and never lose a note again.”
//               </h2>
//               <p className="text-gray-600">A simple, elegant place to keep your ideas organized.</p>
//             </div>

//             <div className="bg-white rounded-2xl shadow p-10 flex flex-col items-center justify-center">
//               <h3 className="text-2xl font-semibold mb-4">Get started</h3>
//               <p className="text-gray-600 text-center mb-6">Sign up to create, edit and manage personal notes.</p>
//               <Link to="/signup" className="bg-indigo-600 text-white px-6 py-3 rounded-lg">Sign Up</Link>
//             </div>
//           </div>
//         </main>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Navbar
//         setQuery={setQuery}
//         isSidebarOpen={isSidebarOpen}
//         setSidebarOpen={setSidebarOpen}
//         onFilterSelect={(v) => setFilter(v)}
//         currentFilter={filter}
//         onDateSelect={(val) => setDateFilter(val)}
//         onNewNoteClick={handleNewNoteClick}
//       />

//       <div className="flex">
//         <Sidebar isOpen={isSidebarOpen} closeSidebar={() => setSidebarOpen(false)} />

//         <main className="flex-1 p-8">
//           <div className="max-w-7xl mx-auto">
//             {/* Top header area */}
//             <div className="flex items-center justify-between mb-6">
//               <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
//               <div className="text-sm text-gray-500">Welcome back — here's your workspace</div>
//             </div>

//             {/* Coming up */}
//             <section className="mb-8">
//               <h2 className="text-lg font-semibold text-gray-700 mb-3">Coming up</h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {comingUpNotes.length > 0 ? (
//                   comingUpNotes.map((note) => (
//                     <div key={note._id} className="bg-white rounded-lg shadow-sm border p-4 flex items-start gap-4">
//                       <div className="w-10 h-10 rounded bg-indigo-50 flex items-center justify-center text-indigo-600 font-semibold">
//                         📌
//                       </div>
//                       <div className="flex-1">
//                         <div className="flex items-center justify-between">
//                           <h3 className="font-medium text-gray-800">{note.title}</h3>
//                           <div className="text-xs text-gray-400">{new Date(note.createdAt).toLocaleString()}</div>
//                         </div>
//                         <p className="mt-2 text-sm text-gray-600 line-clamp-2">{note.description}</p>
//                       </div>
//                     </div>
//                   ))
//                 ) : (
//                   <div className="text-gray-500">No upcoming notes</div>
//                 )}
//               </div>
//             </section>

//             {/* Today */}
//             <section>
//               <h2 className="text-lg font-semibold text-gray-700 mb-3">Today</h2>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 {todayNotes.length > 0 ? (
//                   todayNotes.map((note) => (
//                     <Card
//                       key={note._id}
//                       note={note}
//                       onEdit={onEdit}
//                       deleteNote={deleteNote}
//                       toggleCompletion={toggleCompletion}
//                     />
//                   ))
//                 ) : (
//                   <div className="text-gray-500">No notes for today</div>
//                 )}
//               </div>
//             </section>
//           </div>
//         </main>
//       </div>

//       {isModalOpen && (
//         <NoteModal closeModal={closeModal} addNote={addNote} currentNote={currentNote} editNote={editNote} />
//       )}
//     </div>
//   );
// };

// export default Home;
