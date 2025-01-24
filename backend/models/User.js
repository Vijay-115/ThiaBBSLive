const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Explicitly import ObjectId from mongoose.Schema.Types
const { ObjectId } = mongoose.Schema.Types;

const UserSchema = new mongoose.Schema({
    user_id: { type: ObjectId, required: true, unique: true }, // Unique identifier for the user
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    name: String, // User's full name
    email: { type: String, unique: true }, // User's email (unique)
    password: String, // Encrypted user password
    phone: String, // User's phone number
    address: [
        {
        street: String,
        city: String,
        state: String,
        zip: String,
        country: String,
        },
    ], // Array of saved addresses
    created_at: { type: Date, default: Date.now }, // Account creation date
    updated_at: { type: Date, default: Date.now }, // Last updated date
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
