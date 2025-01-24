const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Explicitly import ObjectId from mongoose.Schema.Types
const { ObjectId } = mongoose.Schema.Types;

const CartSchema = new mongoose.Schema({
    cart_id: { type: ObjectId, required: true, unique: true }, // Unique identifier for the cart
    user_id: ObjectId, // ID of the user owning the cart (reference to Users collection)
    products: [
      {
        product_id: ObjectId, // Product ID (reference to Products collection)
        quantity: Number, // Quantity of the product in the cart
        price: Number, // Price of the product
      },
    ], // List of products in the cart
    total_price: Number, // Total price of the cart
    created_at: { type: Date, default: Date.now }, // Cart creation date
    updated_at: { type: Date, default: Date.now }, // Last updated date
});

const Cart = mongoose.model('Cart', CartSchema);
module.exports = Cart;
