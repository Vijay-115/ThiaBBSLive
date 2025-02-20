const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, default: 1 },
    cart_id: { type: String, unique: true, default: function() { return new mongoose.Types.ObjectId().toString(); } }
});

const Cart = mongoose.model("Cart", CartSchema);
module.exports = Cart;
