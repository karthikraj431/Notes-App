import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import NoteModal from "./NoteModal";
import Card from "./Card";
import Sidebar from "./Sidebar";
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
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState(""); // yyyy-mm-dd
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (user) fetchNotes();
    else {
      setNotes([]);
      setFilteredNotes([]);
    }
    // eslint-disable-next-line
  }, [user]);

  useEffect(() => {
    applySearchFilter();
    // eslint-disable-next-line
  }, [notes, query, filter, dateFilter]);

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

  const applySearchFilter = () => {
    let temp = [...notes];

    // If dateFilter present, show notes created on that date
    if (dateFilter) {
      temp = temp.filter((n) => {
        const created = new Date(n.createdAt);
        const yyyy = created.getFullYear();
        const mm = String(created.getMonth() + 1).padStart(2, "0");
        const dd = String(created.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}` === dateFilter;
      });
    }

    if (query) {
      const q = query.toLowerCase();
      temp = temp.filter(
        (n) =>
          n.title.toLowerCase().includes(q) || n.description.toLowerCase().includes(q)
      );
    }

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
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to add note");
    }
  };

  const editNote = async (id, title, description) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return toast.error("No token found, please login");
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
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to edit note");
    }
  };

  const deleteNote = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return toast.error("No token found, please login");
      const { data } = await axios.delete(`${API_URL}/api/note/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        toast.success("Note deleted successfully!");
        fetchNotes();
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete note");
    }
  };

  const toggleCompletion = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const { data } = await axios.put(
        `${API_URL}/api/note/toggle/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        setNotes((prev) => prev.map((n) => (n._id === id ? data.note : n)));
        toast.success(
          `Note marked as ${data.note.completed ? "Completed" : "Not Completed"}`
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update note status");
    }
  };

  // New note button in navbar
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

  // group notes for UI: Coming up (next 5 newest), Today (created today)
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayNotes = filteredNotes.filter((n) => new Date(n.createdAt) >= startOfToday);
  // Coming up: the most recent 5 notes that are NOT created today (or simply first 5 of filteredNotes)
  const comingUpNotes = filteredNotes
    .filter((n) => new Date(n.createdAt) < startOfToday)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  // If not logged in show hero (already in original)
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
        <nav className="w-full bg-white shadow-md py-4 px-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">NotaAI</h1>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-gray-700 font-medium hover:text-indigo-600 transition">
              Login
            </Link>
            <Link to="/signup" className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition">
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
              <p className="text-gray-600">A simple, elegant place to keep your ideas organized.</p>
            </div>

            <div className="bg-white rounded-2xl shadow p-10 flex flex-col items-center justify-center">
              <h3 className="text-2xl font-semibold mb-4">Get started</h3>
              <p className="text-gray-600 text-center mb-6">Sign up to create, edit and manage personal notes.</p>
              <Link to="/signup" className="bg-indigo-600 text-white px-6 py-3 rounded-lg">Sign Up</Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        setQuery={setQuery}
        isSidebarOpen={isSidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onFilterSelect={(v) => setFilter(v)}
        currentFilter={filter}
        onDateSelect={(val) => setDateFilter(val)}
        onNewNoteClick={handleNewNoteClick}
      />

      <div className="flex">
        <Sidebar isOpen={isSidebarOpen} closeSidebar={() => setSidebarOpen(false)} />

        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Top header area */}
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
              <div className="text-sm text-gray-500">Welcome back — here's your workspace</div>
            </div>

            {/* Coming up */}
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-gray-700 mb-3">Coming up</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {comingUpNotes.length > 0 ? (
                  comingUpNotes.map((note) => (
                    <div key={note._id} className="bg-white rounded-lg shadow-sm border p-4 flex items-start gap-4">
                      <div className="w-10 h-10 rounded bg-indigo-50 flex items-center justify-center text-indigo-600 font-semibold">
                        📌
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-gray-800">{note.title}</h3>
                          <div className="text-xs text-gray-400">{new Date(note.createdAt).toLocaleString()}</div>
                        </div>
                        <p className="mt-2 text-sm text-gray-600 line-clamp-2">{note.description}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500">No upcoming notes</div>
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
                  <div className="text-gray-500">No notes for today</div>
                )}
              </div>
            </section>
          </div>
        </main>
      </div>

      {isModalOpen && (
        <NoteModal closeModal={closeModal} addNote={addNote} currentNote={currentNote} editNote={editNote} />
      )}
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
//   const { user, logout } = useAuth();
//   const [notes, setNotes] = useState([]);
//   const [filteredNotes, setFilteredNotes] = useState([]);
//   const [isModalOpen, setModalOpen] = useState(false);
//   const [currentNote, setCurrentNote] = useState(null);
//   const [query, setQuery] = useState("");
//   const [filter, setFilter] = useState(""); // Current selected filter
//   const [isSidebarOpen, setSidebarOpen] = useState(false);
//   const API_URL = import.meta.env.VITE_API_URL;

//   useEffect(() => {
//     if (user) fetchNotes();
//     else {
//       setNotes([]);
//       setFilteredNotes([]);
//     }
//   }, [user]);

//   // Apply search + filter
//   useEffect(() => {
//     let tempNotes = [...notes];

//     // Search filter
//     tempNotes = tempNotes.filter(
//       (note) =>
//         note.title.toLowerCase().includes(query.toLowerCase()) ||
//         note.description.toLowerCase().includes(query.toLowerCase())
//     );

//     // Dropdown filter
//     switch (filter) {
//       case "completed":
//         tempNotes = tempNotes.filter((note) => note.completed);
//         break;
//       case "incomplete":
//         tempNotes = tempNotes.filter((note) => !note.completed);
//         break;
//       case "dateAsc":
//         tempNotes.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
//         break;
//       case "dateDesc":
//         tempNotes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//         break;
//       default:
//         break;
//     }

//     setFilteredNotes(tempNotes);
//   }, [query, notes, filter]);

//   // Fetch notes from API
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

//   // Add note
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

//   // Edit note
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

//   // Delete note
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

//   // Toggle completion status
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
//         setNotes(notes.map((n) => (n._id === id ? data.note : n)));
//         toast.success(
//           `Note marked as ${data.note.completed ? "Completed" : "Not Completed"}`
//         );
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to update note status");
//     }
//   };

//   const onEdit = (note) => { setCurrentNote(note); setModalOpen(true); };
//   const closeModal = () => { setCurrentNote(null); setModalOpen(false); };

//   // Non-user view
//   if (!user) {
//     return (
//       <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
//         <nav className="w-full bg-white shadow-md py-4 px-6 flex justify-between items-center">
//           <h1 className="text-2xl font-bold text-blue-600">Notes App</h1>
//           <div className="flex items-center gap-4">
//             <Link to="/login" className="text-gray-700 font-medium hover:text-blue-600 transition">Login</Link>
//             <Link to="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition">Signup</Link>
//           </div>
//         </nav>
//         <div className="flex flex-1 flex-col md:flex-row items-center justify-between px-8 md:px-16 py-10 md:gap-16">
//           <div className="md:w-1/2 text-center md:text-left mb-10 md:mb-0">
//             <h2 className="text-4xl font-extrabold text-gray-800 leading-snug mb-4">
//               “Capture your thoughts, <br /> shape your ideas, and never lose a note again.”
//             </h2>
//             <p className="text-gray-600 text-lg mt-2">
//               A simple, elegant place to keep your ideas organized.
//             </p>
//             <div className="mt-6">
//               <img src="https://cdn-icons-png.flaticon.com/512/3081/3081654.png" alt="Premium Notes illustration" className="w-48 mx-auto md:mx-0 opacity-90"/>
//             </div>
//           </div>
//           <div className="md:w-1/2 flex flex-col items-center justify-center bg-white rounded-2xl shadow-lg p-10">
//             <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
//               To personalize your notes, please sign up!
//             </h3>
//             <p className="text-gray-600 text-center mb-6">
//               Join now to create, edit, and manage your personal notes easily.
//             </p>
//             <Link to="/signup" className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition">Sign Up</Link>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // User view
//   return (
//     <div className="flex">
//       {user && <Sidebar isOpen={isSidebarOpen} closeSidebar={() => setSidebarOpen(false)} />}
//       <div className="flex-1 flex flex-col">
//         <Navbar
//           setQuery={setQuery}
//           isSidebarOpen={isSidebarOpen}
//           setSidebarOpen={setSidebarOpen}
//           onFilterSelect={setFilter}
//           currentFilter={filter}
//         />

//         {/* Notes Section */}
//         <div className={`p-6 transition-all duration-300 ${isSidebarOpen ? "md:ml-64" : ""}`}>
//           {(() => {
//             const now = new Date();
//             const startOfToday = new Date(now.setHours(0,0,0,0));
//             const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
//             const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

//             const todayNotes = filteredNotes.filter(n => new Date(n.createdAt) >= startOfToday);
//             const weekNotes = filteredNotes.filter(n => new Date(n.createdAt) >= startOfWeek && new Date(n.createdAt) < startOfToday);
//             const monthNotes = filteredNotes.filter(n => new Date(n.createdAt) >= startOfMonth && new Date(n.createdAt) < startOfWeek);
//             const olderNotes = filteredNotes.filter(n => new Date(n.createdAt) < startOfMonth);

//             const renderSection = (title, notes) => notes.length > 0 && (
//               <div className="mb-10">
//                 <h2 className="text-2xl font-semibold text-gray-800 mb-4">{title}</h2>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                   {notes.map(note => (
//                     <Card key={note._id} note={note} onEdit={onEdit} deleteNote={deleteNote} toggleCompletion={toggleCompletion} />
//                   ))}
//                 </div>
//               </div>
//             );

//             return filteredNotes.length > 0 ? (
//               <>
//                 {renderSection("Today's Notes", todayNotes)}
//                 {renderSection("This Week", weekNotes)}
//                 {renderSection("This Month", monthNotes)}
//                 {renderSection("Older Notes", olderNotes)}
//               </>
//             ) : <p className="text-center text-gray-500 mt-10">No Notes</p>;
//           })()}
//         </div>

//         {/* Add Note Button */}
//         <button onClick={() => setModalOpen(true)} className="fixed bottom-8 right-8 bg-blue-600 text-white text-3xl px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 transition">+</button>

//         {isModalOpen && <NoteModal closeModal={closeModal} addNote={addNote} currentNote={currentNote} editNote={editNote} />}
//       </div>
//     </div>
//   );
// };

// export default Home;