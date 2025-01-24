const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Explicitly import ObjectId from mongoose.Schema.Types
const { ObjectId } = mongoose.Schema.Types;

const OrderSchema = new mongoose.Schema({
  order_id: { type: ObjectId, required: true, unique: true }, // Unique identifier for the order
  user_id: ObjectId, // ID of the user placing the order (reference to Users collection)
  products: [
    {
      product_id: ObjectId, // Product ID (reference to Products collection)
      quantity: Number, // Quantity of the product ordered
      price: Number, // Price of the product
    },
  ], // List of ordered products
  total_price: Number, // Total price of the order
  shipping_address: {
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String,
  }, // Shipping address for the order
  status: { type: String, default: 'pending' }, // Order status (e.g., pending, shipped, delivered, canceled)
  payment_method: String, // Payment method (e.g., card, COD)
  created_at: { type: Date, default: Date.now }, // Order creation date
  updated_at: { type: Date, default: Date.now }, // Last updated date
});

const Order = mongoose.model('Order', OrderSchema);
module.exports = Order;
