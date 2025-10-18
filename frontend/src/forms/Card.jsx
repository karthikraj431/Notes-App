import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const Card = ({ note, onEdit, deleteNote, toggleCompletion, toggleFavorite }) => {
  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800">{note.title}</h3>
          <p className="mt-2 text-sm text-gray-600 line-clamp-3">{note.description}</p>

          {note.scheduleDate && (
            <span className="text-xs text-gray-400 mt-1 block">
              Scheduled: {new Date(note.scheduleDate).toLocaleDateString()}
            </span>
          )}

          <div className="mt-3 flex items-center gap-3">
            <span className={`text-xs font-medium ${note.completed ? "text-green-600" : "text-red-600"}`}>
              {note.completed ? "Completed" : "Not Completed"}
            </span>
            <span className="text-xs text-gray-400">{new Date(note.createdAt).toLocaleString()}</span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <button
            onClick={() => toggleCompletion(note._id)}
            className="text-sm px-3 py-1 border rounded text-yellow-700 hover:bg-yellow-50"
          >
            Progress
          </button>

          <button
            onClick={() => toggleFavorite(note._id)}
            className="text-sm px-3 py-1 border rounded text-yellow-500 hover:bg-yellow-50"
          >
            {note.favorite ? "★ Favorite" : "☆ Mark Favorite"}
          </button>

          <div className="flex gap-2 mt-2">
            <button onClick={() => onEdit(note)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded">
              <FaEdit />
            </button>
            <button onClick={() => deleteNote(note._id)} className="p-2 text-red-600 hover:bg-red-50 rounded">
              <FaTrash />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;




// import React from "react";
// import { FaEdit, FaTrash } from "react-icons/fa";

// const Card = ({ note, onEdit, deleteNote, toggleCompletion }) => {
//   return (
//     <div className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition">
//       <div className="flex items-start justify-between gap-4">
//         <div>
//           <h3 className="font-semibold text-gray-800">{note.title}</h3>
//           <p className="mt-2 text-sm text-gray-600 line-clamp-3">{note.description}</p>

//           <div className="mt-3 flex items-center gap-3">
//             <span className={`text-xs font-medium ${note.completed ? "text-green-600" : "text-red-600"}`}>
//               {note.completed ? "Completed" : "Not Completed"}
//             </span>
//             <span className="text-xs text-gray-400">{new Date(note.createdAt).toLocaleString()}</span>
//           </div>
//         </div>

//         <div className="flex flex-col items-end gap-2">
//           <button
//             onClick={() => toggleCompletion(note._id)}
//             className="text-sm px-3 py-1 border rounded text-yellow-700 hover:bg-yellow-50"
//           >
//             Progress
//           </button>

//           <div className="flex gap-2">
//             <button onClick={() => onEdit(note)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded">
//               <FaEdit />
//             </button>
//             <button onClick={() => deleteNote(note._id)} className="p-2 text-red-600 hover:bg-red-50 rounded">
//               <FaTrash />
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Card;