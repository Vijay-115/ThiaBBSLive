const Product = require('../models/Product');
const Variant = require("../models/Variant");
const path = require('path');
const fs = require('fs');

exports.createProduct = async (req, res) => {
    try {
        const { product_id, name, description, price, stock, SKU, brand, weight, dimensions, tags, category_id, subcategory_id, variantData } = req.body;

        // Ensure `req.files` contains the uploaded files
        const productImage = req.files['product_img'] ? `/uploads/${req.files['product_img'][0].filename}` : '';
        const galleryImages = req.files['gallery_imgs'] ? req.files['gallery_imgs'].map(file => `/uploads/${file.filename}`) : [];

        // Get the current user's ID from the authenticated request
        const seller_id = req.user ? req.user.userId : null;
        if (!seller_id) {
            return res.status(401).json({ message: "Unauthorized: User ID not found" });
        }

        let newProduct;

        // If variantData exists, create product without price/stock and handle variants
        if (variantData && variantData.length > 0) {
            newProduct = new Product({
                product_id,
                name,
                description,
                SKU,
                brand,
                weight,
                dimensions,
                tags,
                category_id,
                subcategory_id,
                product_img: productImage,
                gallery_imgs: galleryImages,
                seller_id,
            });

            await newProduct.save();

            // Create variants for the product
            const variants = variantData.map(variant => ({
                product_id: newProduct._id,
                variant_name: variant.variant_name,
                price: variant.price,
                stock: variant.stock,
                SKU: variant.SKU,
                attributes: variant.attributes,
                variant_img: variant.variant_img || '',
            }));

            await Variant.insertMany(variants);
        } else {
            // If no variantData, create a standard product with price and stock
            newProduct = new Product({
                product_id,
                name,
                description,
                price,
                stock,
                SKU,
                brand,
                weight,
                dimensions,
                tags,
                category_id,
                subcategory_id,
                product_img: productImage,
                gallery_imgs: galleryImages,
                seller_id,
            });

            await newProduct.save();
        }

        res.status(201).json(newProduct);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

// READ: Get all products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('category_id subcategory_id seller_id');
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// READ: Get a single product by product_id
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category_id subcategory_id seller_id');
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
        const existingProduct = await Product.findOne({ product_id: productId });
        if (!existingProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        let updatedProductData = { ...req.body };

        if (req.files && req.files['product_img']) {
            updatedProductData.product_img = `/uploads/${req.files['product_img'][0].filename}`;
        } else {
            updatedProductData.product_img = existingProduct.product_img;
        }

        if (req.files && req.files['gallery_imgs']) {
            const newGalleryImages = req.files['gallery_imgs'].map(file => `/uploads/${file.filename}`);
            updatedProductData.gallery_imgs = [...existingProduct.gallery_imgs, ...newGalleryImages];
        } else {
            updatedProductData.gallery_imgs = existingProduct.gallery_imgs;
        }

        if (req.body.variants) {
            updatedProductData.variants = JSON.parse(req.body.variants);
        }

        const updatedProduct = await Product.findOneAndUpdate(
            { product_id: productId },
            updatedProductData,
            { new: true }
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
        const product = await Product.findOne({ product_id: req.params.id });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const { product_img, gallery_imgs } = product;
        const uploadDir = path.join(__dirname, '../uploads');

        const deleteImage = (filePath) => {
            if (filePath) {
                const fullPath = path.join(uploadDir, path.basename(filePath));
                if (fs.existsSync(fullPath)) {
                    fs.unlink(fullPath, (err) => {
                        if (err) {
                            console.error(`Error deleting file ${fullPath}:`, err);
                        }
                    });
                }
            }
        };

        deleteImage(product_img);
        if (Array.isArray(gallery_imgs) && gallery_imgs.length > 0) {
            gallery_imgs.forEach(deleteImage);
        }

        await Product.findOneAndDelete({ product_id: req.params.id });
        res.status(200).json({ message: 'Product and associated images deleted successfully' });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: err.message });
    }
};