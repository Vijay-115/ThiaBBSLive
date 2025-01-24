const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Explicitly import ObjectId from mongoose.Schema.Types
const { ObjectId } = mongoose.Schema.Types;

const ProductSchema = new mongoose.Schema({
    product_id: { type: ObjectId, required: true, unique: true }, // Unique identifier for the product
    name: String, // Product name
    description: String, // Product description
    price: Number, // Product price
    stock: Number, // Stock quantity
    category: String, // Product category
    image_urls: [String], // Array of image URLs
    created_at: { type: Date, default: Date.now }, // Product creation date
    updated_at: { type: Date, default: Date.now },
});

const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;
