import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinaryConfig.js";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => { // Remove `async` if not needed
    console.log("User ID from middleware:", req.user?.id);

    if (!req.user?.id) {
      throw new Error("User not authenticated.");
    }

    return {
      folder: `users/${req.user.id}`,
      format: "png",
      public_id: `${Date.now()}-${file.originalname.replace(/\.[^/.]+$/, "")}`,
    };
  },
});

const upload = multer({ storage });
export default upload;