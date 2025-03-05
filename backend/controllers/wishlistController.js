const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const mongoose = require('mongoose');

exports.addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        console.log("Received Data:", req.body);

        if (!productId) {
            return res.status(400).json({ message: "Product ID is required" });
        }

        let userId = req.user ? req.user.userId : null;

        if (!userId) {
            if (!req.session.userId) {
                req.session.userId = new mongoose.Types.ObjectId().toString();
            }
            userId = req.session.userId;
        }

        // Check if the product exists
        let product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Find existing wishlist for the user
        let wishlist = await Wishlist.findOne({ user_id: userId });

        // If wishlist doesn't exist, create a new one
        if (!wishlist) {
            wishlist = new Wishlist({
                user_id: userId,
                products: [{ product_id: productId }],
                created_at: new Date(),
                updated_at: new Date(),
            });
        } else {
            // Check if the product is already in the wishlist
            if (wishlist.products.some(item => item.product_id.toString() === productId)) {
                return res.status(400).json({ message: "Product already in wishlist" });
            }

            // Add product to the wishlist
            wishlist.products.push({ product_id: productId });
            wishlist.updated_at = new Date();
        }

        // Save the wishlist
        await wishlist.save();
        res.status(201).json({ message: "Product added to wishlist", wishlist });
    } catch (error) {
        console.error("Error adding to wishlist:", error);
        res.status(500).json({ message: "Error adding to wishlist", error });
    }
};

exports.getWishlist = async (req, res) => {
    console.log('getWishlist');
    try {
        let userId = req.user ? req.user.userId : null;

        if (!userId) {
            if (!req.session.userId) {
                return res.status(400).json({ message: "User ID is required" });
            }
            userId = req.session.userId;
        }

        // Find the wishlist by user_id
        let wishlist = await Wishlist.findOne({ user_id: userId }).populate('products.product_id', 'name price'); // Populate product details

        if (!wishlist) {
            return res.status(404).json({ message: "Wishlist not found" });
        }

        res.status(200).json(wishlist);
    } catch (error) {
        console.error("Error retrieving wishlist:", error);
        res.status(500).json({ message: "Error retrieving wishlist", error });
    }
};

exports.removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({ message: "Product ID is required" });
        }

        let userId = req.user ? req.user.userId : null;

        if (!userId) {
            if (!req.session.userId) {
                return res.status(400).json({ message: "User ID is required" });
            }
            userId = req.session.userId;
        }

        // Find the wishlist by user_id
        let wishlist = await Wishlist.findOne({ user_id: userId });

        if (!wishlist) {
            return res.status(404).json({ message: "Wishlist not found" });
        }

        // Find the index of the product to remove
        const productIndex = wishlist.products.findIndex(
            item => item.product_id.toString() === productId
        );

        if (productIndex === -1) {
            return res.status(404).json({ message: "Product not found in wishlist" });
        }

        // Remove the product from the wishlist
        wishlist.products.splice(productIndex, 1);
        wishlist.updated_at = new Date();

        // Save the updated wishlist
        await wishlist.save();

        res.status(200).json({ message: "Product removed from wishlist", wishlist });
    } catch (error) {
        console.error("Error removing from wishlist:", error);
        res.status(500).json({ message: "Error removing from wishlist", error });
    }
};