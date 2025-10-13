import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import authRouter from "./routes/Auth.js";
import noteRouter from "./routes/note.js";
import connectToMongoDB from "./mongo/db.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/note", noteRouter);

// Connect to MongoDB Atlas
connectToMongoDB();

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


// import dotenv from "dotenv";
// dotenv.config();
// import express from 'express'
// import cors from 'cors'
// import authRouter from './routes/Auth.js'
// import noteRouter from './routes/note.js'
// import connectToMongoDB from './mongo/db.js'

// const app = express()
// app.use(cors())
// app.use(express.json())
// app.use('/api/auth', authRouter)
// app.use('/api/note', noteRouter)
// app.listen(5000, () => {
//     connectToMongoDB()
//     console.log("Server is Running")
// })