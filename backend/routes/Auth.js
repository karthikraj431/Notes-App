import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import middleware from '../middleware/middleware.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  console.log("Received body:", req.body);
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      console.log("Missing fields");
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

   
    const existingUser = await User.findOne({ email });
    console.log("Existing user:", existingUser);
    if (existingUser) return res.status(401).json({ success: false, message: "User already exists" });

    
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed password:", hashedPassword);

   
    const newUser = new User({ name, email, password: hashedPassword });
    const savedUser = await newUser.save();
    console.log("Saved user:", savedUser);

    return res.status(200).json({ success: true, message: "Account created successfully!" });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ success: false, message: "Account not created!" });
  }
});
    


router.post('/login', async (req, res) => {
  console.log("Login body:", req.body);
  try {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ success: false, message: "All fields are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ success: false, message: "User doesn't exist" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ success: false, message: "Wrong credentials" });

    const token = jwt.sign({ id: user._id }, "secretkey", { expiresIn: "5h" });
    return res.status(200).json({ success: true, token, user: { name: user.name }, message: "Logged in successfully!" });
  } catch (error) {
    console.log("Login error:", error.message);
    return res.status(500).json({ success: false, message: "Login failed" });
  }
});


router.get('/verify', middleware, async (req, res) => {
  return res.status(200).json({ success: true, user: req.user });
});

export default router;

