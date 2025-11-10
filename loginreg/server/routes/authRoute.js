import express from "express";
import QRCode from "qrcode";
import User from "../models/User.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "This email is already registered." });
    }

    const user = new User({ name, email, password });
    await user.save();

    const userData = `Name: ${user.name}\nEmail: ${user.email}\nID: ${user._id}`;
    const qrCode = await QRCode.toDataURL(userData);

    res.status(201).json({
      message: "Signup successful",
      qrCode,
    });
  } catch (err) {
    console.error("🚨 Database or Server Error:", err);
    res.status(500).json({ message: "Internal Server Error during signup." });
  }
});

export default router;
