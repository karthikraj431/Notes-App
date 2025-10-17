import React, { useEffect, useState } from "react";

const NoteModal = ({ closeModal, addNote, currentNote, editNote }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (currentNote) {
      setTitle(currentNote.title);
      setDescription(currentNote.description);
    } else {
      setTitle("");
      setDescription("");
    }
  }, [currentNote]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    if (currentNote) {
      editNote(currentNote._id, title, description);
    } else {
      addNote(title, description);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-lg p-6 shadow">
        <h3 className="text-lg font-semibold mb-4">{currentNote ? "Edit Note" : "New Note"}</h3>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="px-3 py-2 border rounded"
            required
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="px-3 py-2 border rounded h-28"
            required
          />
          <div className="flex justify-end gap-2 mt-3">
            <button type="button" onClick={closeModal} className="px-4 py-2 rounded bg-gray-200">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 rounded bg-indigo-600 text-white">
              {currentNote ? "Save" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteModal;





// import React, { useEffect, useState } from "react";

// const NoteModal = ({ closeModal, addNote, currentNote, editNote }) => {
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");

//   useEffect(() => {
//     if (currentNote) {
//       setTitle(currentNote.title);
//       setDescription(currentNote.description);
//     } else {
//       setTitle("");
//       setDescription("");
//     }
//   }, [currentNote]);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (currentNote) {
//       editNote(currentNote._id, title, description);
//     } else {
//       addNote(title, description);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
//       <div className="bg-white p-6 rounded shadow-lg w-96">
//         <h2 className="text-xl font-bold mb-4">{currentNote ? "Edit Note" : "Add Note"}</h2>
//         <form onSubmit={handleSubmit} className="flex flex-col gap-3">
//           <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="p-2 border rounded" required />
//           <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="p-2 border rounded" required />
//           <div className="flex justify-end gap-2 mt-4">
//             <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">{currentNote ? "Save" : "Add"}</button>
//             <button type="button" onClick={closeModal} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition">Cancel</button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default NoteModal;