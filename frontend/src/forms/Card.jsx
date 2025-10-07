import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const Card = ({ note, onEdit, deleteNote }) => {
  return (
    <div className="border p-4 rounded shadow hover:shadow-lg transition bg-white">
      <h2 className="font-bold text-lg">{note.title}</h2>
      <p className="mt-2 text-gray-700">{note.description}</p>
      <div className="mt-4 flex justify-end gap-2">
        <button onClick={() => onEdit(note)} className="text-blue-500 hover:text-blue-700">
          <FaEdit />
        </button>
        <button onClick={() => deleteNote(note._id)} className="text-red-500 hover:text-red-700">
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

export default Card;
