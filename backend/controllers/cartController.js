const mongoose = require("mongoose");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

// ✅ Get all cart items for a user
exports.getCartItems = async (req, res) => {
    try {
        const userId = req.user ? req.user.userId : null;
        const cartItems = await Cart.find({ user: userId }).populate("product");
        res.status(200).json(cartItems);
    } catch (error) {
        res.status(500).json({ message: "Error fetching cart items", error });
    }
};

// ✅ Add a product to the cart
exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        console.log("Received Data:", req.body); // ✅ Debugging

        if (!productId) {
            return res.status(400).json({ message: "Product ID is required" });
        }

        const userId = req.user ? req.user.userId : null;
        let product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        let cartItem = await Cart.findOne({ user: userId, product: productId });

        if (cartItem) {
            cartItem.quantity += quantity;
            await cartItem.save();
        } else {
            cartItem = new Cart({ 
                user: userId, 
                product: productId, 
                quantity,
                cart_id: new mongoose.Types.ObjectId().toString() // ✅ Fix: Generate unique cart_id
            });

            console.log("Saving Cart Item:", cartItem); // ✅ Debugging
            await cartItem.save();
        }

        res.status(201).json({ message: "Added to cart", cartItem });
    } catch (error) {
        console.error("Error adding to cart:", error);
        res.status(500).json({ message: "Error adding to cart", error });
    }
};

// ✅ Update cart item quantity
exports.updateQuantity = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user ? req.user.userId : null;

        let cartItem = await Cart.findOne({ user: userId, product: productId });

        if (!cartItem) return res.status(404).json({ message: "Cart item not found" });

        cartItem.quantity = quantity;
        await cartItem.save();

        res.status(200).json({ message: "Quantity updated", cartItem });
    } catch (error) {
        res.status(500).json({ message: "Error updating quantity", error });
    }
};

// ✅ Remove a product from the cart
exports.removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user ? req.user.userId : null;

        await Cart.findOneAndDelete({ user: userId, product: productId });

        res.status(200).json({ message: "Removed from cart" });
    } catch (error) {
        res.status(500).json({ message: "Error removing from cart", error });
    }
};

// ✅ Clear the entire cart
exports.clearCart = async (req, res) => {
    try {
        const userId = req.user ? req.user.userId : null;

        await Cart.deleteMany({ user: userId });

        res.status(200).json({ message: "Cart cleared" });
    } catch (error) {
        res.status(500).json({ message: "Error clearing cart", error });
    }
};
