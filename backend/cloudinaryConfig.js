// cloudinaryConfig.js
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY,   
  api_secret: process.env.CLOUDINARY_API_SECRET, 
});


const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: (req, file) => {
      // Get userId from middleware-injected user object
      const userId = req.user?.id || 'temp';
      return `users/${userId}`;
    },
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 1200, height: 1200, crop: 'limit' }]
  }
});

// Create multer upload middleware
const uploadMiddleware = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Handler for single image upload
const uploadUserImage = (req, res) => {
  
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    res.status(200).json({
      message: 'Image uploaded successfully',
      imageUrl: req.file.path,
      details: req.file
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      error: 'Error uploading image',
      details: error.message
    });
  }
};


const uploadMultipleImages = (req, res) => {

  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const imageUrls = req.files.map(file => file.path);

    res.status(200).json({
      message: 'Images uploaded successfully',
      imageUrls,
      details: req.files
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      error: 'Error uploading images',
      details: error.message
    });
  }
};

export { uploadMiddleware as upload, uploadUserImage, uploadMultipleImages };