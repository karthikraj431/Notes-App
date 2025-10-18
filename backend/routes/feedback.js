// routes/feedback.js
import express from "express";
import Feedback from "../models/Feedback.js";
import { verifyToken } from "../middleware/auth.js"; // your JWT middleware

const router = express.Router();

// Add new feedback
router.post("/", verifyToken, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const feedback = new Feedback({
      userId: req.user._id,
      userName: req.user.name,
      rating,
      comment,
    });
    await feedback.save();
    res.status(201).json({ success: true, feedback });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get all feedbacks (for non-user home page)
router.get("/", async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json({ success: true, feedbacks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
