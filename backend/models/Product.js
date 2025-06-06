const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema.Types;

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: false }, // Base price (can be overridden by variants)
    stock: { type: Number, default: 0 }, // Total stock (sum of all variant stock)
    SKU: { type: String, unique: true, required: false }, // Unique product identifier
    brand: String, // Optional brand field
    weight: { type: Number }, // Weight in grams or kg
    dimensions: { 
        length: Number, 
        width: Number, 
        height: Number 
    }, // Dimensions for shipping
    tags: [{ type: String }], // Search tags
    product_img: String, // Main image
    gallery_imgs: [String], // Additional images

    // Category & Subcategory (Referencing separate collections)
    category_id: { type: ObjectId, ref: 'Category', required: true },
    subcategory_id: { type: ObjectId, ref: 'Subcategory' },

    // Variants - Store multiple variant IDs
    is_variant: { type: Boolean, default: false },
    variants: [{ type: ObjectId, ref: 'Variant' }], // Array of Variant IDs

    // Review
    is_review: { type: Boolean, default: false },

    // Seller reference
    seller_id: { type: ObjectId, ref: 'User', required: true },

    // Timestamps
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

// Middleware to update `updated_at` before saving
ProductSchema.pre('save', function (next) {
    this.updated_at = Date.now();
    next();
});

const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;