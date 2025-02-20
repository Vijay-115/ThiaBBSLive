const Product = require('../models/Product');
const path = require('path');
const fs = require('fs');

// CREATE: Add a new product with image upload
exports.createProduct = async (req, res) => {
    try {
        const { product_id, name, description, price, stock, category } = req.body;

        // Ensure `req.files` contains the uploaded files
        const productImage = req.files['product_img'] ? `/uploads/${req.files['product_img'][0].filename}` : '';
        const galleryImages = req.files['gallery_imgs'] ? req.files['gallery_imgs'].map(file => `/uploads/${file.filename}`) : [];

        // Get the current user's ID from the authenticated request
        const seller_id = req.user ? req.user.userId : null;  // Assuming user info is stored in req.user

        if (!seller_id) {
            return res.status(401).json({ message: "Unauthorized: User ID not found" });
        }

        // Create a new product with seller_id and image paths
        const newProduct = new Product({
            product_id,
            name,
            description,
            price,
            stock,
            category,
            product_img: productImage, // Single product image
            gallery_imgs: galleryImages, // Multiple gallery images
            seller_id, // Save the seller's ID
        });

        await newProduct.save();

        res.status(201).json(newProduct);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};


// READ: Get all products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// READ: Get a single product by product_id
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findOne({ product_id: req.params.id });  // Query by product_id
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// UPDATE: Update a product by product_id with image upload
exports.updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;

        // Fetch the existing product
        const existingProduct = await Product.findOne({ product_id: productId });
        if (!existingProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Initialize updated fields
        let updatedProductData = { ...req.body };

        // Handle single product image update
        if (req.files && req.files['product_img']) {
            updatedProductData.product_img = `/uploads/${req.files['product_img'][0].filename}`;
        } else {
            updatedProductData.product_img = existingProduct.product_img; // Retain old image
        }

        // Handle multiple gallery images update
        if (req.files && req.files['gallery_imgs']) {
            const newGalleryImages = req.files['gallery_imgs'].map(file => `/uploads/${file.filename}`);
            updatedProductData.gallery_imgs = [...existingProduct.gallery_imgs, ...newGalleryImages]; // Append new images
        } else {
            updatedProductData.gallery_imgs = existingProduct.gallery_imgs; // Retain old gallery images
        }

        // Update the product
        const updatedProduct = await Product.findOneAndUpdate(
            { product_id: productId },
            updatedProductData,
            { new: true } // Return the updated document
        );

        res.status(200).json(updatedProduct);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};


// DELETE: Delete a product by product_id
exports.deleteProduct = async (req, res) => {
    try {
        // Find the product by product_id
        const product = await Product.findOne({ product_id: req.params.id });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Get product image paths
        const { product_img, gallery_imgs } = product;

        // Define the uploads directory (check your actual upload path)
        const uploadDir = path.join(__dirname, '../uploads');

        console.log('Upload Directory:', uploadDir);

        // Function to delete a file safely
        const deleteImage = (filePath) => {
            if (filePath) {
                const fullPath = path.join(uploadDir, path.basename(filePath));

                console.log('Attempting to delete:', fullPath);

                if (fs.existsSync(fullPath)) {
                    fs.unlink(fullPath, (err) => {
                        if (err) {
                            console.error(`Error deleting file ${fullPath}:`, err);
                        } else {
                            console.log(`Deleted file: ${fullPath}`);
                        }
                    });
                } else {
                    console.warn(`File does not exist: ${fullPath}`);
                }
            }
        };

        // Delete main product image
        deleteImage(product_img);

        // Delete gallery images (if any)
        if (Array.isArray(gallery_imgs) && gallery_imgs.length > 0) {
            gallery_imgs.forEach(deleteImage);
        }

        // Delete the product from the database
        await Product.findOneAndDelete({ product_id: req.params.id });

        res.status(200).json({ message: 'Product and associated images deleted successfully' });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: err.message });
    }
};

