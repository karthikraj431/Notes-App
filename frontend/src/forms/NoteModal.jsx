import React, { useEffect, useState } from "react";

const NoteModal = ({ closeModal, addNote, currentNote, editNote }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (currentNote) {
      setTitle(currentNote.title);
      setDescription(currentNote.description);
    }
  }, [currentNote]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentNote) {
      editNote(currentNote._id, title, description);
    } else {
      addNote(title, description);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">
          {currentNote ? "Edit Note" : "Add Note"}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="p-2 border rounded"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="p-2 border rounded"
          />
          <div className="flex justify-end gap-2 mt-4">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
              {currentNote ? "Save" : "Add"}
            </button>
            <button type="button" onClick={closeModal} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteModal;
