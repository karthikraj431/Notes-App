import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const Card = ({ note, onEdit, deleteNote, toggleCompletion }) => {
  return (
    <div className="border p-4 rounded shadow hover:shadow-lg transition bg-white">
      <h2 className="font-bold text-lg">{note.title}</h2>
      <p className="mt-2 text-gray-700">{note.description}</p>

      {/* Completion status */}
      <div className="mt-2 flex items-center justify-between">
        <span className={`text-sm font-medium ${note.completed ? 'text-green-600' : 'text-red-600'}`}>
          {note.completed ? 'Completed' : 'Not Completed'}
        </span>

        <div className="flex gap-2">
          <button
            onClick={() => toggleCompletion(note._id)}
            className="text-yellow-600 hover:text-yellow-800 text-sm"
          >
            Progress
          </button>

          <button onClick={() => onEdit(note)} className="text-blue-500 hover:text-blue-700">
            <FaEdit />
          </button>
          <button onClick={() => deleteNote(note._id)} className="text-red-500 hover:text-red-700">
            <FaTrash />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;





// import React from "react";
// import { FaEdit, FaTrash } from "react-icons/fa";

// const Card = ({ note, onEdit, deleteNote }) => {
//   return (
//     <div className="border p-4 rounded shadow hover:shadow-lg transition bg-white">
//       <h2 className="font-bold text-lg">{note.title}</h2>
//       <p className="mt-2 text-gray-700">{note.description}</p>
//       <div className="mt-4 flex justify-end gap-2">
//         <button onClick={() => onEdit(note)} className="text-blue-500 hover:text-blue-700">
//           <FaEdit />
//         </button>
//         <button onClick={() => deleteNote(note._id)} className="text-red-500 hover:text-red-700">
//           <FaTrash />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Card;