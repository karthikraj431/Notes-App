// feedback.js
import express from "express";
import Feedback from "../models/Feedback.js";
import authMiddleware from "../middleware/middleware.js"; // use default import

const router = express.Router();

// Create feedback (protected route)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const feedback = await Feedback.create({
      user: req.user.id,
      rating,
      comment,
    });
    res.status(201).json({ success: true, feedback });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get all feedback (public)
router.get("/", async (req, res) => {
  try {
    const feedbacks = await Feedback.find().populate("user", "name");
    res.status(200).json({ success: true, feedbacks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;




// // routes/feedback.js
// import express from "express";
// import Feedback from "../models/Feedback.js";
// import { verifyToken } from "../middleware/middleware.js"; // your JWT middleware

// const router = express.Router();

// // Add new feedback
// router.post("/", verifyToken, async (req, res) => {
//   try {
//     const { rating, comment } = req.body;
//     const feedback = new Feedback({
//       userId: req.user._id,
//       userName: req.user.name,
//       rating,
//       comment,
//     });
//     await feedback.save();
//     res.status(201).json({ success: true, feedback });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// });

// // Get all feedbacks (for non-user home page)
// router.get("/", async (req, res) => {
//   try {
//     const feedbacks = await Feedback.find().sort({ createdAt: -1 });
//     res.json({ success: true, feedbacks });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// });

// export default router;
