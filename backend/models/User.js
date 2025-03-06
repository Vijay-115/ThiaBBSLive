const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Explicitly import ObjectId from mongoose.Schema.Types
const { ObjectId } = mongoose.Schema.Types;

const UserSchema = new mongoose.Schema({
    role: { type: String, enum: ['user', 'admin', 'seller', 'customer', 'agent', 'territory_head', 'franchise'], default: 'user' },
    name: String,
    email: { type: String, unique: true }, // User's email (unique)
    password: String, // Encrypted user password
    userdetails: { type: ObjectId, ref: 'UserDetails' },
    created_at: { type: Date, default: Date.now }, // Account creation date
    updated_at: { type: Date, default: Date.now }, // Last updated date
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
