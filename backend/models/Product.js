const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Explicitly import ObjectId from mongoose.Schema.Types
const { ObjectId } = mongoose.Schema.Types;

const ProductSchema = new mongoose.Schema({
    product_id: { type: String, required: true, unique: true }, // Use String instead of ObjectId
    name: String,
    description: String,
    price: Number,
    stock: Number,
    category: String,
    image_urls: [String],
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});

const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;
