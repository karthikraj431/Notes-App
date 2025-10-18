import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import authRouter from "./routes/Auth.js";
import noteRouter from "./routes/note.js";
import feedbackRoutes from "./routes/feedback.js";
import connectToMongoDB from "./mongo/db.js";

const app = express();

// CORS configuration
const allowedOrigins = [
  "https://notes-app-53v7-kkjz06pd4-karthiks-projects-08479416.vercel.app", // your deployed frontend
  "http://localhost:5173" // local dev
];

app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `CORS policy: The origin ${origin} is not allowed.`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));

app.use(express.json());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/note", noteRouter);
app.use("/api/feedback", feedbackRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("Notes App Backend is running!");
});

// Connect to MongoDB
connectToMongoDB();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



// import dotenv from "dotenv";
// dotenv.config();

// import express from "express";
// import cors from "cors";
// import authRouter from "./routes/Auth.js";
// import noteRouter from "./routes/note.js";
// import connectToMongoDB from "./mongo/db.js";
// import feedbackRoutes from "./routes/feedback.js";

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Routes
// app.use("/api/auth", authRouter);
// app.use("/api/note", noteRouter);

// app.use("/api/feedback", feedbackRoutes);

// // Connect to MongoDB Atlas
// connectToMongoDB();

// // Start the server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

