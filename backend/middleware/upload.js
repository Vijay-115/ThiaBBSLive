const multer = require("multer");

// Set storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Ensure this folder exists
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName); // Naming convention for each file
    },
});

// Define the upload middleware for specific fields
const upload = multer({ storage });

// Define the fields you want to handle (one for a single image and another for multiple images)
const uploadFields = upload.fields([
    { name: 'product_img', maxCount: 1 }, // Single product image
    { name: 'gallery_imgs', maxCount: 5 } // Multiple gallery images (limit to 5)
]);

// Middleware for handling multiple file uploads
exports.uploadFields = uploadFields; // Export the middleware so you can use it in your routes
