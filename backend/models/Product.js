const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema.Types;

const ProductSchema = new mongoose.Schema({
    product_id: { type: String, required: true, unique: true }, // Keep as String if necessary
    name: String,
    description: String,
    price: Number,
    stock: Number,
    category: String,
    product_img: String,
    gallery_imgs: [String],
    seller_id: { type: ObjectId, ref: 'User', required: true }, // Reference to the User/Seller collection
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});

// Middleware to update `updated_at` before saving
ProductSchema.pre('save', function (next) {
    this.updated_at = Date.now();
    next();
});

const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;
