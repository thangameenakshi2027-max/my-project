import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import session from "express-session";
import MongoStore from "connect-mongo";
import cors from "cors";
import dotenv from "dotenv";
import User from "./model/User.js";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;


app.use(express.json());
app.use(cors({
  origin: ["http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));


mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/mern_dashboard", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));


app.use(session({
  secret: process.env.SESSION_SECRET || "supersecretkey",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/mern_dashboard"
  }),
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

app.get("/api/users", async (req, res) => {
  const users = await User.find(); 
  res.json(users);
});
app.delete("/api/users/:id", async (req, res) => {
  try {
    const { id } = req.params; 
    
   
    const deletedUser = await User.findByIdAndDelete(id); 

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });

  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ message: "Server error while deleting user" });
  }
});

app.post("/api/users", async (req, res) => {
  const { name, email, password } = req.body;
  const existing = await User.findOne({ email }); 
  if (existing) return res.status(400).json({ message: "Email exists" });
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ name, email, password: hashedPassword }); 
  await newUser.save();
  res.status(201).json(newUser);
});


app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "No user found with that email" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ message: "Incorrect password" });

    
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || "supersecretkey",
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
});

app.post("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) res.status(500).json("Logout failed");
    else res.status(200).json("Logout successful");
  });
});

app.get("/user", (req, res) => {
  if (req.session.user) res.json({ user: req.session.user });
  else res.status(401).json("Not authenticated");
});
app.put("/api/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;

    const updateFields = { name, email };

  
    if (password && password.trim() !== "") {
      updateFields.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateFields,
      { new: true } 
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser); 

  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Server error while updating user" });
  }
});


app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
