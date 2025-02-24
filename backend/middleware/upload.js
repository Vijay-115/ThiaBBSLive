const multer = require("multer");
const path = require("path");

// Set storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Ensure this folder exists
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName); // Unique file naming
    },
});

// File filter to allow only images
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type. Only JPG, JPEG, and PNG are allowed!"), false);
    }
};

// Define multer upload with size limits (5MB per file)
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter,
});

// Define the fields for handling different file types
const uploadFields = upload.fields([
    { name: "product_img", maxCount: 1 }, // Single product image
    { name: "profilePic", maxCount: 1 }, // Single product image
    { name: "gallery_imgs", maxCount: 5 } // Multiple gallery images (max 5)
]);

// Middleware for handling multiple file uploads
exports.uploadFields = uploadFields; // Export the middleware
