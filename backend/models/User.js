const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  userdetails: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserDetails", // must match your model name
  },
  role: { type: String, enum: ["admin", "user"], default: "user" },
});

// ✅ Log and export using shared auth DB
const User = mongoose.model("User", userSchema);
module.exports = User;
