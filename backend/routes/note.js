import express from 'express'
import Note from '../models/Note.js';
import middleware from '../middleware/middleware.js';

const  router = express.Router()

router.post('/add',middleware , async (req, res) => {
    try
    {
        const {title, description} = req.body;
        const newNote = new Note({
            title, description,
            userId: req.user.id
        })
        await newNote.save()
        return res.status(200).json({success: true, message: "Note Added successfully!"})
    }
    catch(error)
    {
        console.log(error.message)
        return res.status(500).json({success: false, message: "Eoor in addiing note!"})
    }
})
router.get('/',middleware, async(req,res) =>{
    try{
        const notes = await Note.find({userId: req.user.id})
        return res.status(200).json({success: true, notes})
    }catch(error)
    {
        return res.status(300).json({success: false, message: "Can't retrieve notes"})
    }
})

router.put("/:id", async(req,res) =>{
    try{
        const {id} = req.params;
        const updateNote = await Note.findByIdAndUpdate(id,req.body)
        return res.status(200).json({success: true, updateNote})
    }catch(error)
    {
        return res.status(300).json({success: false, message: "Can't update notes"})
    }
})

// router.delete("/:id", async(req,res) =>{
//     try{
//         const {id} = req.params;
//         const deleteNote = await Note.findByIdAndDelete(id)
//         return res.status(200).json({success: true, deleteNote})
//     }catch(error)
//     {
//         return res.status(300).json({success: false, message: "Can't delete notes"})
//     }
// })

router.delete("/:id", middleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Optional: ensure user can only delete their own note
    const note = await Note.findById(id);
    if (!note) return res.status(404).json({ success: false, message: "Note not found" });
    if (note.userId.toString() !== req.user.id)
      return res.status(403).json({ success: false, message: "Not authorized" });

    await Note.findByIdAndDelete(id);
    return res.status(200).json({ success: true, message: "Note deleted successfully!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Can't delete note" });
  }
});

export default router