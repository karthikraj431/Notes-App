import React, { useEffect, useState } from "react";

const NoteModal = ({ closeModal, addNote, currentNote, editNote }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");

  useEffect(() => {
    if (currentNote) {
      setTitle(currentNote.title);
      setDescription(currentNote.description);
      setScheduleDate(currentNote.scheduleDate ? new Date(currentNote.scheduleDate).toISOString().slice(0, 10) : "");
    } else {
      setTitle("");
      setDescription("");
      setScheduleDate("");
    }
  }, [currentNote]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    if (currentNote) {
      editNote(currentNote._id, title, description, scheduleDate);
    } else {
      addNote(title, description, scheduleDate);
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
          <label className="text-sm text-gray-600">Schedule Date (optional)</label>
          <input
            type="date"
            value={scheduleDate}
            onChange={(e) => setScheduleDate(e.target.value)}
            className="px-3 py-2 border rounded"
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
