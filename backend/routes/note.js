import express from 'express';
import Note from '../models/Note.js';
import middleware from '../middleware/middleware.js';

const router = express.Router();

// Add note
router.post('/add', middleware, async (req, res) => {
  try {
    const { title, description } = req.body;
    const newNote = new Note({ title, description, userId: req.user.id });
    await newNote.save();
    return res.status(200).json({ success: true, message: "Note added successfully!" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, message: "Error adding note" });
  }
});

// Get notes
router.get('/', middleware, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.id });
    return res.status(200).json({ success: true, notes });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Can't retrieve notes" });
  }
});

// Update note
router.put("/:id", middleware, async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findById(id);
    if (!note) return res.status(404).json({ success: false, message: "Note not found" });
    if (note.userId.toString() !== req.user.id) return res.status(403).json({ success: false, message: "Not authorized" });

    const updatedNote = await Note.findByIdAndUpdate(id, req.body, { new: true });
    return res.status(200).json({ success: true, updatedNote });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Can't update note" });
  }
});

// Toggle completion ✅
router.put("/toggle/:id", middleware, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ success: false, message: "Note not found" });
    if (note.userId.toString() !== req.user.id) return res.status(403).json({ success: false, message: "Not authorized" });

    note.completed = !note.completed;
    await note.save();

    return res.status(200).json({ success: true, note });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Delete note
router.delete("/:id", middleware, async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findById(id);

    if (!note)
      return res.status(404).json({ success: false, message: "Note not found" });

    if (note.userId.toString() !== req.user.id)
      return res.status(403).json({ success: false, message: "Not authorized" });

    await Note.findByIdAndDelete(id);
    return res.status(200).json({ success: true, message: "Note deleted successfully!" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Can't delete note" });
  }
});

export default router;