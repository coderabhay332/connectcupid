// app.js
import express from "express";
import { User, Profile, Tag, UserTag, UserQuestion, Question } from "./db/index.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import mongoose from "mongoose";
import middleware from "./middleware.js";
import { upload, uploadUserImage, uploadMultipleImages } from "./cloudinaryConfig.js";
const app = express();


app.use(express.json());
dotenv.config();

app.get("/tags", async (req, res) => { 
  try {
    const tags = await Tag.find();
    const tagNames = tags.map(tag => tag.name);
    res.json(tagNames);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
})


app.post("/tags", middleware, async (req, res) => {
  const userId = req.user.id;
  const { tags } = req.body;
  console.log(tags);

  if (!tags || !Array.isArray(tags)) {
    return res.status(400).json({ message: "Tags are required and must be an array." });
  }
  if (!userId) {
    return res.status(400).json({ message: "User is required." });
  }

  try {
    const allTagIds = [];
    for (const element of tags) {
      const existingTag = await Tag.findOne({ name: element });
      if (existingTag) {
       
        allTagIds.push(existingTag._id);
      } else {
        return res.status(400).json({ message: `${element} tag does not exist.` });
      }
    }
    
    await UserTag.create({ userId, interests: allTagIds });
    return res.status(201).json({ message: "User tags created successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});
app.post("/questions", middleware, async (req, res) => {
  const userId = req.user.id;
  const { response } = req.body; // Expecting an array of { question, answer }

  if (!response || !Array.isArray(response)) {
    return res
      .status(400)
      .json({ message: "Response must be an array of question/answer objects." });
  }

  try {
    const answers = [];
    for (const element of response) {
      let questionId;
      if (mongoose.isValidObjectId(element.question)) {
        questionId = element.question;
      } else {
        const questionDoc = await Question.findOne({ name: element.question });
        if (!questionDoc) {
          return res
            .status(400)
            .json({ message: `Question "${element.question}" does not exist.` });
        }
        questionId = questionDoc._id;
      }
      answers.push({
        question: questionId,
        answer: element.answer,
      });
    }

    // Create one UserQuestion document containing all answers
    const userQuestions = await UserQuestion.create({ userId, answers });
    return res.status(201).json({
      message: "User questions created successfully",
      userQuestions,
    });
  } catch (error) {
    console.error("Error creating user questions:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});
app.post('/upload', middleware, upload.single('image'), uploadUserImage);
app.post('/upload-multiple', middleware, upload.array('images', 5), uploadMultipleImages);

// Auth routes

app.get("/", (req, res) => {
  res.send("Welcome to the dating app API");

})


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
  const { age, height, phoneNo, location, name, gender } = req.body;

  if (!age || !height || !phoneNo || !location, !gender, !name) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingProfile = await Profile.findOne({ userId: req.user.id });
    if (existingProfile) {
      return res.status(403).json({ message: "Profile already exists for this user" });
    }

    const profile = await Profile.create({
      name,
      gender,
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