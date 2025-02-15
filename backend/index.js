import express from "express";
import { User, Profile } from "./db/index.js";
import cloudinary from "./cloudinaryConfig.js";
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "./db/config.js";
import bcrypt from "bcrypt";
import middleware from "./middleware.js";
const app = express();
import upload from "./uploadMiddleware.js";


// Middleware to parse JSON bodies
app.use(express.json());

app.post("/upload", middleware, upload.single("image"), async (req, res) => {
  try {
    console.log("Middleware executed, proceeding to upload...");

    // Check if file was processed
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    // Log Cloudinary upload result
    console.log("Cloudinary upload result:", req.file);

    // Respond with Cloudinary URL
    return res.json({
      message: "Image uploaded successfully",
      imageUrl: req.file.path,
    });

  } catch (error) {
    console.error("Upload failed:", error);
    return res.status(500).json({ error: "Upload failed", details: error.message });
  }
});


app.post("/signin", async (req, res) => {
  const {  email, password } = req.body;

  try {

    const checkEmail = await User.findOne({email: email})
    console.log("check mail", checkEmail)
    if(!checkEmail){
      return res.status(403).json({message: "User not exists"})
    }
    
    
    const hashPassword =await bcrypt.compare(password, checkEmail.password)
    console.log(hashPassword)

    if(!hashPassword){
      return res.status(401).json({
        message: "wrong password"
      })
    }
    const token = jwt.sign({ id: checkEmail._id }, JWT_PASSWORD);

    res.json({ token });
  } catch (error) {
    console.error("Error during signin:", error);
    res.status(500).send("Server error");
  }
});

app.post("/signup", async (req, res) => {
 const email = req.body.email;
 const password = req.body.password;
 
  console.log(req.body.email + password)
  if (!email || !password) {
    return res.status(400).send("Username and password are required.");
  }

  try {
    const currentUser = await User.findOne({ email });

    if (currentUser) {
      return res.status(409).send("User already exists.");
    }
    const hashPassword =await bcrypt.hash(password, 10)
    console.log(hashPassword)

    const newUser = await User.create({ email,password: hashPassword });

    return res.status(201).json({
      message: "User created successfully.",
      user: newUser,
    });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).send("Server error");
  }
});

app.post("/profile",middleware,  async (req, res) => {
  const { age, height, phoneNo, location } = req.body;

  if (!age || !height || !phoneNo || !location ) {
    return res.status(400).send("All fields are required.");
  }

  const userId = req.user.id

  const alreadyExists = await Profile.findOne({userId})
  console.log(alreadyExists)
  if(alreadyExists){
    return res.status(403).send({
      message: "profile already exists for the user"
    })
  }

  try {
    const profile = await Profile.create({
      age,
      height,
      phoneNo,
      location,
      userId: userId,
    });

    res.status(201).json({
      message: "Profile created successfully.",
      profile,
    });
  } catch (error) {
    console.error("Error creating profile:", error);
    res.status(500).send("Server error");
  }
});



// app.post("/upload-pictures", upload.array("pictures", 2), async (req, res) => {
//   try {
//     if (!req.files || req.files.length === 0) {
//       return res.status(400).json({ message: "No pictures were uploaded." });
//     }

//     const imageUrls = req.files.map((file) => file.path);

//     res.status(200).json({
//       message: "Pictures uploaded successfully!",
//       pictures: imageUrls,
//     });
//   } catch (error) {
//     console.error("Error uploading pictures:", error);
//     res.status(500).json({ message: "Something went wrong during the upload.", error });
//   }
// });

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
