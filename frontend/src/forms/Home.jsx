import React, { useEffect, useState } from "react"; 
import Navbar from "./Navbar";
import NoteModal from "./NoteModal";
import Card from "./Card";
import FeedbackModal from "./FeedbackModal";
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
  const [isFeedbackOpen, setFeedbackOpen] = useState(false);
  const [usersList, setUsersList] = useState([]);
  const [feedbackList, setFeedbackList] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (user) fetchNotes();
    else {
      setNotes([]);
      setFilteredNotes([]);
    }
  }, [user]);

  useEffect(() => {
    applySearchFilter();
  }, [notes, query, filter, dateFilter]);

  useEffect(() => {
    fetchUsersAndFeedback();
  }, []);

  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const { data } = await axios.get(`${API_URL}/api/note`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) setNotes(data.notes);
    } catch (error) {
      toast.error("Failed to fetch notes");
    }
  };

  const fetchUsersAndFeedback = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/users`);
      if (data.success) {
        setUsersList(data.users);
        setFeedbackList(data.feedback || []);
      }
    } catch {}
  };

  const applySearchFilter = () => {
    let temp = [...notes];
    if (query) {
      const q = query.toLowerCase();
      temp = temp.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.description.toLowerCase().includes(q)
      );
    }
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (filter) {
      case "all": break;
      case "today": temp = temp.filter((n) => new Date(n.createdAt) >= startOfToday); break;
      case "scheduled": temp = temp.filter((n) => n.scheduleDate && new Date(n.scheduleDate) >= startOfToday); break;
      case "favorites": temp = temp.filter((n) => n.favorite); break;
      case "completed": temp = temp.filter((n) => n.completed); break;
      case "incomplete": temp = temp.filter((n) => !n.completed); break;
      case "dateAsc": temp.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)); break;
      case "dateDesc": temp.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); break;
      default: break;
    }

    if (dateFilter) {
      temp = temp.filter((n) => {
        const created = new Date(n.createdAt);
        const yyyy = created.getFullYear();
        const mm = String(created.getMonth() + 1).padStart(2, "0");
        const dd = String(created.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}` === dateFilter;
      });
    }
    setFilteredNotes(temp);
  };

  const addNote = async (title, description, scheduleDate) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const { data } = await axios.post(
        `${API_URL}/api/note/add`,
        { title, description, scheduleDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        fetchNotes();
        setModalOpen(false);
        toast.success("Note added successfully!");
        // Auto feedback popup
        if (window.confirm("Would you like to leave feedback?")) setFeedbackOpen(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add note");
    }
  };

  const editNote = async (id, title, description, scheduleDate) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.put(
        `${API_URL}/api/note/${id}`,
        { title, description, scheduleDate },
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

  const submitFeedback = async ({ rating, comment }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const { data } = await axios.post(
        `${API_URL}/api/feedback`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        toast.success("Feedback submitted!");
        fetchUsersAndFeedback();
      }
    } catch {
      toast.error("Failed to submit feedback");
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
    } catch {
      toast.error("Failed to delete note");
    }
  };

  const toggleCompletion = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.put(`${API_URL}/api/note/toggle/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) setNotes((prev) => prev.map((n) => (n._id === id ? data.note : n)));
    } catch { toast.error("Failed to update note"); }
  };

  const toggleFavorite = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.put(`${API_URL}/api/note/favorite/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) setNotes((prev) => prev.map((n) => (n._id === id ? data.note : n)));
    } catch { toast.error("Failed to toggle favorite"); }
  };

  const handleNewNoteClick = () => { setCurrentNote(null); setModalOpen(true); };
  const onEdit = (note) => { setCurrentNote(note); setModalOpen(true); };
  const closeModal = () => { setCurrentNote(null); setModalOpen(false); };
  const closeFeedback = () => setFeedbackOpen(false);

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const todayNotes = filteredNotes.filter((n) => new Date(n.createdAt) >= startOfToday);

  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1); tomorrow.setHours(0,0,0,0);
  const comingUpNotes = filteredNotes
    .filter((n) => n.scheduleDate && new Date(n.scheduleDate) >= tomorrow)
    .sort((a,b)=>new Date(a.scheduleDate)-new Date(b.scheduleDate))
    .slice(0,5);

  if (!user) {
    return (
      <div className="min-h-screen flex bg-gray-50 font-sans">
        <div className="flex flex-1">
          {/* Left Half */}
          <div className="flex-1 bg-indigo-50 flex flex-col items-center justify-center p-10 text-center">
            <div className="text-6xl mb-6">🔖</div>
            <h2 className="text-4xl font-bold mb-4">“Capture your thoughts, shape your ideas, and never lose a note again.”</h2>
          </div>
          {/* Right Half */}
          <div className="flex-1 flex flex-col p-6">
            {/* Users */}
            <div className="flex-1 mb-4 bg-white shadow rounded p-4">
              <h3 className="font-semibold mb-3">Our Users</h3>
              <ul className="list-disc pl-5 space-y-1">
                {usersList.length > 0 ? usersList.map((u)=>(
                  <li key={u._id}>{u.name}</li>
                )) : <li>No users yet</li>}
              </ul>
            </div>
            {/* Feedback */}
            <div className="flex-1 bg-white shadow rounded p-4 overflow-y-auto">
              <h3 className="font-semibold mb-3">User Feedback</h3>
              {feedbackList.length > 0 ? feedbackList.map((f,i)=>(
                <div key={i} className="border-b py-2">
                  <div className="text-yellow-400">{'★'.repeat(f.rating) + '☆'.repeat(5-f.rating)}</div>
                  <p className="text-gray-700">{f.comment}</p>
                </div>
              )) : <p className="text-gray-400">No feedback yet</p>}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Logged-in user page
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
            {notes.length > 0 ? notes.map((note) => (
              <button key={note._id} onClick={() => onEdit(note)} className="w-full text-left px-3 py-2 rounded-lg hover:bg-indigo-50 transition">
                <p className="font-medium text-gray-700 truncate">{note.title}</p>
              </button>
            )) : <p className="text-gray-400 text-sm">No notes yet</p>}
          </div>
        </div>
        <div className="border-t px-4 py-4 space-y-3">
          <button onClick={() => setFeedbackOpen(true)} className="w-full flex items-center justify-between px-3 py-2 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition">
            Feedback <span>⭐</span>
          </button>
          <button onClick={() => { localStorage.removeItem("token"); window.location.href = "/"; }} className="w-full flex items-center justify-between px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition">
            Logout <span></span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <Navbar
          setQuery={setQuery}
          onFilterSelect={setFilter}
          currentFilter={filter}
          onDateSelect={setDateFilter}
          onNewNoteClick={handleNewNoteClick}
        />

        <main className="flex-1 px-8 py-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Coming Up */}
            <section>
              <h2 className="text-lg font-semibold text-gray-700 mb-3">Coming Up</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {comingUpNotes.length > 0 ? comingUpNotes.map((note) => (
                  <Card key={note._id} note={note} onEdit={onEdit} deleteNote={deleteNote} toggleCompletion={toggleCompletion} toggleFavorite={toggleFavorite} />
                )) : <p className="text-gray-400">No upcoming notes</p>}
              </div>
            </section>

            {/* Today */}
            <section>
              <h2 className="text-lg font-semibold text-gray-700 mb-3">Today</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {todayNotes.length > 0 ? todayNotes.map((note) => (
                  <Card key={note._id} note={note} onEdit={onEdit} deleteNote={deleteNote} toggleCompletion={toggleCompletion} toggleFavorite={toggleFavorite} />
                )) : <p className="text-gray-400">No notes for today</p>}
              </div>
            </section>
          </div>
        </main>
      </div>

      {isModalOpen && <NoteModal closeModal={closeModal} addNote={addNote} currentNote={currentNote} editNote={editNote} />}
      {isFeedbackOpen && <FeedbackModal closeModal={closeFeedback} submitFeedback={submitFeedback} />}
    </div>
  );
};

export default Home;





// import React, { useEffect, useState } from "react"; 
// import Navbar from "./Navbar";
// import NoteModal from "./NoteModal";
// import Card from "./Card";
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
//   const [dateFilter, setDateFilter] = useState("");
//   const API_URL = import.meta.env.VITE_API_URL;

//   // Fetch notes on login
//   useEffect(() => {
//     if (user) fetchNotes();
//     else {
//       setNotes([]);
//       setFilteredNotes([]);
//     }
//     // eslint-disable-next-line
//   }, [user]);

//   // Re-filter whenever notes/search/filter/date change
//   useEffect(() => {
//     applySearchFilter();
//     // eslint-disable-next-line
//   }, [notes, query, filter, dateFilter]);

//   // Fetch all notes
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

//   // Apply filters and search
//   const applySearchFilter = () => {
//     let temp = [...notes];

//     // Filter by search query
//     if (query) {
//       const q = query.toLowerCase();
//       temp = temp.filter(
//         (n) =>
//           n.title.toLowerCase().includes(q) ||
//           n.description.toLowerCase().includes(q)
//       );
//     }

//     const now = new Date();
//     const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

//     // Filter by status
//     switch (filter) {
//       case "all":
//         break;
//       case "today":
//         temp = temp.filter((n) => new Date(n.createdAt) >= startOfToday);
//         break;
//       case "scheduled":
//         temp = temp.filter((n) => n.scheduleDate && new Date(n.scheduleDate) >= startOfToday);
//         break;
//       case "favorites":
//         temp = temp.filter((n) => n.favorite);
//         break;
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

//     // Filter by specific date
//     if (dateFilter) {
//       temp = temp.filter((n) => {
//         const created = new Date(n.createdAt);
//         const yyyy = created.getFullYear();
//         const mm = String(created.getMonth() + 1).padStart(2, "0");
//         const dd = String(created.getDate()).padStart(2, "0");
//         return `${yyyy}-${mm}-${dd}` === dateFilter;
//       });
//     }

//     setFilteredNotes(temp);
//   };

//   // CRUD actions
//   const addNote = async (title, description, scheduleDate) => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) return;
//       const { data } = await axios.post(
//         `${API_URL}/api/note/add`,
//         { title, description, scheduleDate },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       if (data.success) {
//         fetchNotes();
//         setModalOpen(false);
//         toast.success("Note added successfully!");
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to add note");
//     }
//   };

//   const editNote = async (id, title, description, scheduleDate) => {
//     try {
//       const token = localStorage.getItem("token");
//       const { data } = await axios.put(
//         `${API_URL}/api/note/${id}`,
//         { title, description, scheduleDate },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       if (data.success) {
//         fetchNotes();
//         setModalOpen(false);
//         toast.success("Note updated successfully!");
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to edit note");
//     }
//   };

//   const deleteNote = async (id) => {
//     try {
//       const token = localStorage.getItem("token");
//       const { data } = await axios.delete(`${API_URL}/api/note/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (data.success) {
//         toast.success("Note deleted successfully!");
//         fetchNotes();
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to delete note");
//     }
//   };

//   const toggleCompletion = async (id) => {
//     try {
//       const token = localStorage.getItem("token");
//       const { data } = await axios.put(
//         `${API_URL}/api/note/toggle/${id}`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       if (data.success) {
//         setNotes((prev) => prev.map((n) => (n._id === id ? data.note : n)));
//         toast.success(`Note marked as ${data.note.completed ? "Completed" : "Not Completed"}`);
//       }
//     } catch {
//       toast.error("Failed to update note status");
//     }
//   };

//   const toggleFavorite = async (id) => {
//     try {
//       const token = localStorage.getItem("token");
//       const { data } = await axios.put(
//         `${API_URL}/api/note/favorite/${id}`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       if (data.success) {
//         setNotes((prev) => prev.map((n) => (n._id === id ? data.note : n)));
//         toast.success(data.note.favorite ? "Marked as favorite" : "Removed from favorite");
//       }
//     } catch {
//       toast.error("Failed to toggle favorite");
//     }
//   };

//   // Note modal controls
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

//   // Group notes for UI
//   const now = new Date();
//   const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

//   const todayNotes = filteredNotes.filter((n) => new Date(n.createdAt) >= startOfToday);

//   // Coming up notes: scheduleDate >= tomorrow
//   const tomorrow = new Date();
//   tomorrow.setDate(tomorrow.getDate() + 1);
//   tomorrow.setHours(0, 0, 0, 0);

//   const comingUpNotes = filteredNotes
//     .filter((n) => n.scheduleDate && new Date(n.scheduleDate) >= tomorrow)
//     .sort((a, b) => new Date(a.scheduleDate) - new Date(b.scheduleDate))
//     .slice(0, 5);

//   if (!user) {
//     return (
//       <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
//         <nav className="w-full bg-white shadow-md py-4 px-6 flex justify-between items-center">
//           <h1 className="text-2xl font-bold text-indigo-600">NOTES</h1>
//           <div className="flex items-center gap-4">
//             <Link to="/login" className="text-gray-700 font-medium hover:text-indigo-600 transition">Login</Link>
//             <Link to="/signup" className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition">Signup</Link>
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

//   // Logged-in dashboard UI
//   return (
//     <div className="min-h-screen flex bg-gray-50 text-gray-800">
//       {/* Sidebar */}
//       <aside className="w-64 bg-white border-r flex flex-col">
//         <div className="px-6 py-6 border-b">
//           <h1 className="text-2xl font-bold text-indigo-600">NOTES</h1>
//         </div>
//         <div className="flex-1 overflow-y-auto px-4 py-4">
//           <h2 className="text-sm font-semibold text-gray-500 mb-3">My Notes</h2>
//           <div className="space-y-2">
//             {notes.length > 0 ? notes.map((note) => (
//               <button key={note._id} onClick={() => onEdit(note)} className="w-full text-left px-3 py-2 rounded-lg hover:bg-indigo-50 transition">
//                 <p className="font-medium text-gray-700 truncate">{note.title}</p>
//               </button>
//             )) : <p className="text-gray-400 text-sm">No notes yet</p>}
//           </div>
//         </div>
//         <div className="border-t px-4 py-4 space-y-3">
//           <button onClick={() => toast.info("Password reset popup here")} className="w-full flex items-center justify-between px-3 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition">
//             Reset Password <span>🔒</span>
//           </button>
//           <button onClick={() => { localStorage.removeItem("token"); window.location.href = "/"; }} className="w-full flex items-center justify-between px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition">
//             Logout <span>🚪</span>
//           </button>
//         </div>
//       </aside>

//       {/* Main */}
//       <div className="flex-1 flex flex-col">
//         <Navbar
//           setQuery={setQuery}
//           onFilterSelect={setFilter}
//           currentFilter={filter}
//           onDateSelect={setDateFilter}
//           onNewNoteClick={handleNewNoteClick}
//         />

//         <main className="flex-1 px-8 py-6 overflow-y-auto">
//           <div className="max-w-7xl mx-auto space-y-8">

//             {/* Coming Up */}
//             <section>
//               <h2 className="text-lg font-semibold text-gray-700 mb-3">Coming Up</h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {comingUpNotes.length > 0 ? comingUpNotes.map((note) => (
//                   <Card
//                     key={note._id}
//                     note={note}
//                     onEdit={onEdit}
//                     deleteNote={deleteNote}
//                     toggleCompletion={toggleCompletion}
//                     toggleFavorite={toggleFavorite}
//                   />
//                 )) : <p className="text-gray-400">No upcoming notes</p>}
//               </div>
//             </section>

//             {/* Today */}
//             <section>
//               <h2 className="text-lg font-semibold text-gray-700 mb-3">Today</h2>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 {todayNotes.length > 0 ? todayNotes.map((note) => (
//                   <Card
//                     key={note._id}
//                     note={note}
//                     onEdit={onEdit}
//                     deleteNote={deleteNote}
//                     toggleCompletion={toggleCompletion}
//                     toggleFavorite={toggleFavorite}
//                   />
//                 )) : <p className="text-gray-400">No notes for today</p>}
//               </div>
//             </section>

//           </div>
//         </main>
//       </div>

//       {isModalOpen && (
//         <NoteModal
//           closeModal={closeModal}
//           addNote={addNote}
//           currentNote={currentNote}
//           editNote={editNote}
//         />
//       )}
//     </div>
//   );
// };

// export default Home;