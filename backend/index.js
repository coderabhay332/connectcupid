// app.js
import express from "express";
import { User, Profile } from "./db/index.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import middleware from "./middleware.js";
import { upload, uploadUserImage, uploadMultipleImages } from "./cloudinaryConfig.js";
const app = express();

// Middleware
app.use(express.json());
dotenv.config();
// Image upload routes
app.post('/upload', middleware, upload.single('image'), uploadUserImage);
app.post('/upload-multiple', middleware, upload.array('images', 5), uploadMultipleImages);

// Auth routes



app.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required"
    });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(403).json({ message: "User does not exist" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id },process.env.JWT_PASSWORD);
    res.json({ token });
  } catch (error) {
    console.error("Error during signin:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email, password: hashedPassword });

    res.status(201).json({
      message: "User created successfully",
      user: newUser
    });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/profile", middleware, async (req, res) => {
  const { age, height, phoneNo, location } = req.body;

  if (!age || !height || !phoneNo || !location) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingProfile = await Profile.findOne({ userId: req.user.id });
    if (existingProfile) {
      return res.status(403).json({ message: "Profile already exists for this user" });
    }

    const profile = await Profile.create({
      age,
      height,
      phoneNo,
      location,
      userId: req.user.id
    });

    res.status(201).json({
      message: "Profile created successfully",
      profile
    });
  } catch (error) {
    console.error("Error creating profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});