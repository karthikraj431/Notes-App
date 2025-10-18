import express from "express";
import Feedback from "../models/Feedback.js";
import middleware from "../middleware/middleware.js"; // your auth middleware

const router = express.Router();

// GET all feedbacks (public)
router.get("/", async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json({ success: true, feedbacks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch feedbacks" });
  }
});

// POST feedback (private)
router.post("/", middleware, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const userId = req.user.id;
    const userName = req.user.name || "Anonymous"; // optional

    const feedback = await Feedback.create({ userId, userName, rating, comment });
    res.json({ success: true, feedback });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to submit feedback" });
  }
});

export default router;




// // feedback.js
// import express from "express";
// import Feedback from "../models/Feedback.js";
// import authMiddleware from "../middleware/middleware.js"; // use default import

// const router = express.Router();

// // Create feedback (protected route)
// router.post("/", authMiddleware, async (req, res) => {
//   try {
//     const { rating, comment } = req.body;
//     const feedback = await Feedback.create({
//       user: req.user.id,
//       rating,
//       comment,
//     });
//     res.status(201).json({ success: true, feedback });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// });

// // Get all feedback (public)
// router.get("/", async (req, res) => {
//   try {
//     const feedbacks = await Feedback.find().populate("user", "name");
//     res.status(200).json({ success: true, feedbacks });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// });

// export default router;