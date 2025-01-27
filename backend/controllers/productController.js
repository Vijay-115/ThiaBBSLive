const Product = require('../models/Product');
const path = require('path');

// CREATE: Add a new product with image upload
exports.createProduct = async (req, res) => {
    try {
        const { product_id, name, description, price, stock, category } = req.body;

        // Ensure `req.files` contains the uploaded files
        const imagePaths = req.files.map((file) => {
            // Construct the file path relative to your server's base URL or directory
            return `/uploads/${file.filename}`;
        });

        // Create a new product with the image paths
        const newProduct = new Product({
            product_id,
            name,
            description,
            price,
            stock,
            category,
            image_urls: imagePaths, // Save image paths to the database
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

        // If new images are uploaded, handle them
        let updatedImagePaths = existingProduct.image_urls;
        if (req.files && req.files.length > 0) {
            const newImagePaths = req.files.map((file) =>
                path.join('uploads', file.filename)
            );
            updatedImagePaths = [...updatedImagePaths, ...newImagePaths]; // Append new images
        }

        // Update the product details
        const updatedProduct = await Product.findOneAndUpdate(
            { product_id: productId },
            {
                ...req.body,
                image_urls: updatedImagePaths, // Update the image paths
            },
            { new: true } // Return the updated document
        );

        res.status(200).json(updatedProduct);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// DELETE: Delete a product by product_id
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findOneAndDelete({ product_id: req.params.id });  // Query by product_id
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
