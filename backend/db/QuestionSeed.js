
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Question } from "./index.js";

dotenv.config();

const questions = [
  { name: "Dating me is like" },
  { name: "Lets go on a " },
  { name: "My Ideal Sunday Includes…" },
  { name: "You should go out with me to save me from…." },
  { name: "I want someone who…" },
  { name: "My love language is …" },
  { name: "Don't hate me if i " },
  { name: "First round is on me if… " },
  
];

const dbUrl = process.env.DATABASE_URI || "mongodb://localhost:27017/connectcupid";

async function seedQuestions() {
  try {
   
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("Connected to database.");
    } else {
      console.log("Using existing database connection.");
    }

    // Clear any existing tags
    await Question.deleteMany({});
    console.log("Existing tags cleared.");

    const insertedQuestions = await Question.insertMany(questions);
    console.log("Tags seeded successfully:", insertedQuestions);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Error seeding Questions:", error);
    process.exit(1);
  }
}

seedQuestions();