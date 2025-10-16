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
  const { user, logout } = useAuth();
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);
  const [query, setQuery] = useState("");
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (user) fetchNotes();
    else {
      setNotes([]);
      setFilteredNotes([]);
    }
  }, [user]);

  useEffect(() => {
    setFilteredNotes(
      notes.filter(
        (note) =>
          note.title.toLowerCase().includes(query.toLowerCase()) ||
          note.description.toLowerCase().includes(query.toLowerCase())
      )
    );
  }, [query, notes]);

  // Fetch all notes
  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const { data } = await axios.get(`${API_URL}/api/note`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) setNotes(data.notes);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch notes");
    }
  };

  // Add note
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
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to add note");
    }
  };

  // Edit note
  const editNote = async (id, title, description) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No token found, please login");
        return;
      }
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

  // Delete note
  const deleteNote = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No token found, please login");
        return;
      }
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

  const onEdit = (note) => {
    setCurrentNote(note);
    setModalOpen(true);
  };

  const closeModal = () => {
    setCurrentNote(null);
    setModalOpen(false);
  };

  // Non-user homepage
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
        <nav className="w-full bg-white shadow-md py-4 px-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Notes App</h1>
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-gray-700 font-medium hover:text-blue-600 transition"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Signup
            </Link>
          </div>
        </nav>

        <div className="flex flex-1 flex-col md:flex-row items-center justify-between px-8 md:px-16 py-10 md:gap-16">
          <div className="md:w-1/2 text-center md:text-left mb-10 md:mb-0">
            <h2 className="text-4xl font-extrabold text-gray-800 leading-snug mb-4">
              “Capture your thoughts, <br /> shape your ideas, and never lose a
              note again.”
            </h2>
            <p className="text-gray-600 text-lg mt-2">
              A simple, elegant place to keep your ideas organized.
            </p>
            <div className="mt-6">
              <img
                src="https://cdn-icons-png.flaticon.com/512/3081/3081654.png"
                alt="Premium Notes illustration"
                className="w-48 mx-auto md:mx-0 opacity-90"
              />
            </div>
          </div>

          <div className="md:w-1/2 flex flex-col items-center justify-center bg-white rounded-2xl shadow-lg p-10">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
              To personalize your notes, please sign up!
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Join now to create, edit, and manage your personal notes easily.
            </p>
            <Link
              to="/signup"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Logged-in user homepage
  return (
    <div className="flex">
      {/* Sidebar */}
      {user && (
        <Sidebar
          isOpen={isSidebarOpen}
          closeSidebar={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col">
        <Navbar
          setQuery={setQuery}
          isSidebarOpen={isSidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <div className={`p-4 grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-300 ${isSidebarOpen ? "md:ml-64" : ""}`}>
          {filteredNotes.length > 0 ? (
            filteredNotes.map((note) => (
              <Card
                key={note._id}
                note={note}
                onEdit={onEdit}
                deleteNote={deleteNote}
              />
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">No Notes</p>
          )}
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="fixed bottom-8 right-8 bg-blue-600 text-white text-3xl px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 transition"
        >
          +
        </button>

        {isModalOpen && (
          <NoteModal
            closeModal={closeModal}
            addNote={addNote}
            currentNote={currentNote}
            editNote={editNote}
          />
        )}
      </div>
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
//   const API_URL = import.meta.env.VITE_API_URL;

//   useEffect(() => {
//     if (user) fetchNotes();
//     else {
//       setNotes([]);
//       setFilteredNotes([]);
//     }
//   }, [user]);

//   useEffect(() => {
//     setFilteredNotes(
//       notes.filter(
//         (note) =>
//           note.title.toLowerCase().includes(query.toLowerCase()) ||
//           note.description.toLowerCase().includes(query.toLowerCase())
//       )
//     );
//   }, [query, notes]);

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
//       console.log(error);
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
//       console.log(error);
//       toast.error(error.response?.data?.message || "Failed to add note");
//     }
//   };

//   // Edit note
//   const editNote = async (id, title, description) => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         toast.error("No token found, please login");
//         return;
//       }
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
//       if (!token) {
//         toast.error("No token found, please login");
//         return;
//       }
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

//   const onEdit = (note) => {
//     setCurrentNote(note);
//     setModalOpen(true);
//   };

//   const closeModal = () => {
//     setCurrentNote(null);
//     setModalOpen(false);
//   };

//   // Non-user homepage
//   if (!user) {
//     return (
//       <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
//         <nav className="w-full bg-white shadow-md py-4 px-6 flex justify-between items-center">
//           <h1 className="text-2xl font-bold text-blue-600">Notes App</h1>
//           <div className="flex items-center gap-4">
//             <Link
//               to="/login"
//               className="text-gray-700 font-medium hover:text-blue-600 transition"
//             >
//               Login
//             </Link>
//             <Link
//               to="/signup"
//               className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
//             >
//               Signup
//             </Link>
//           </div>
//         </nav>

//         <div className="flex flex-1 flex-col md:flex-row items-center justify-between px-8 md:px-16 py-10 md:gap-16">
//           <div className="md:w-1/2 text-center md:text-left mb-10 md:mb-0">
//             <h2 className="text-4xl font-extrabold text-gray-800 leading-snug mb-4">
//               “Capture your thoughts, <br /> shape your ideas, and never lose a
//               note again.”
//             </h2>
//             <p className="text-gray-600 text-lg mt-2">
//               A simple, elegant place to keep your ideas organized.
//             </p>
//             <div className="mt-6">
//               <img
//                 src="https://cdn-icons-png.flaticon.com/512/3081/3081654.png"
//                 alt="Premium Notes illustration"
//                 className="w-48 mx-auto md:mx-0 opacity-90"
//               />
//             </div>
//           </div>

//           <div className="md:w-1/2 flex flex-col items-center justify-center bg-white rounded-2xl shadow-lg p-10">
//             <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
//               To personalize your notes, please sign up!
//             </h3>
//             <p className="text-gray-600 text-center mb-6">
//               Join now to create, edit, and manage your personal notes easily.
//             </p>
//             <Link
//               to="/signup"
//               className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition"
//             >
//               Sign Up
//             </Link>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Logged-in user homepage
//   return (
//     <div>
//       <Navbar setQuery={setQuery} />
//       <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
//         {filteredNotes.length > 0 ? (
//           filteredNotes.map((note) => (
//             <Card
//               key={note._id}
//               note={note}
//               onEdit={onEdit}
//               deleteNote={deleteNote}
//             />
//           ))
//         ) : (
//           <p className="text-center text-gray-500 col-span-full">No Notes</p>
//         )}
//       </div>

//       <button
//         onClick={() => setModalOpen(true)}
//         className="fixed bottom-8 right-8 bg-blue-600 text-white text-3xl px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 transition"
//       >
//         +
//       </button>

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