const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Explicitly import ObjectId from mongoose.Schema.Types
const { ObjectId } = mongoose.Schema.Types;

const WishlistSchema = new mongoose.Schema({
    wishlist_id: { type: String, required: true, unique: true }, // Unique identifier for the wishlist
    user_id: ObjectId, // ID of the user owning the wishlist (reference to Users collection)
    products: [
      {
        product_id: ObjectId, // Product ID (reference to Products collection)
      },
    ], // List of product IDs in the wishlist
    created_at: { type: Date, default: Date.now }, // Wishlist creation date
    updated_at: { type: Date, default: Date.now }, // Last updated date
});

const Wishlist = mongoose.model('Wishlist', WishlistSchema);
module.exports = Wishlist;
