import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    completed: { type: Boolean, default: false },
    favorite: { type: Boolean, default: false }, // ⭐ New field
    scheduleDate: { type: Date, default: null }, // 🗓 New field
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Note = mongoose.model("Note", NoteSchema);
export default Note;



// import mongoose from "mongoose";

// const NoteSchema = new mongoose.Schema(
//   {
//     title: { type: String, required: true },
//     description: { type: String, required: true },
//     completed: { type: Boolean, default: false }, // ✅ new field
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   },
//   { timestamps: true }
// );

// const Note = mongoose.model("Note", NoteSchema);
// export default Note;
