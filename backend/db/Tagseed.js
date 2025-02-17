// seed.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Tag } from "./index.js";

dotenv.config();

const tags = [
  { name: "Coding" },
  { name: "Anime" },
  { name: "Games" },
  { name: "Cricket" },
  { name: "Movies" },
  { name: "Music" },
  { name: "Travel" },
  { name: "Sports" },
  
];

const dbUrl = process.env.DATABASE_URL || "mongodb://localhost:27017/yourdbname";

async function seedTags() {
  try {
    // If there's no active connection, connect.
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
    await Tag.deleteMany({});
    console.log("Existing tags cleared.");

    // Insert the predefined tags
    const insertedTags = await Tag.insertMany(tags);
    console.log("Tags seeded successfully:", insertedTags);

    // Disconnect the database and exit the process
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Error seeding tags:", error);
    process.exit(1);
  }
}

seedTags();