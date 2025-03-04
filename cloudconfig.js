import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

// Load environment variables if not in production
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

// Console log for debugging - remove in production
console.log("Cloudinary Config - Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("Cloudinary Config - API Key present:", process.env.CLOUDINARY_KEY ? "Yes" : "No");

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

// Create storage engine for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "wonderlust_DEV",
    allowedFormats: ["jpeg", "png", "jpg"]
  }
});

export { cloudinary, storage };