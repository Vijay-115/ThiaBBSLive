const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const AddressSchema = new mongoose.Schema({
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
    isDefault: { type: Boolean, default: false } // To mark default address
});

const UserDetailsSchema = new mongoose.Schema({
    userId: { type: ObjectId, ref: 'User', required: true, unique: true }, // Reference to User Schema
    referralCode: { type: String, unique: true }, // User's unique referral code
    referredBy: { type: ObjectId, ref: 'User' }, // User who referred them
    phone: { type: String, unique: true, required: true }, // User's phone number
    addresses: [AddressSchema], // List of user addresses
    profilePic: { type: String }, // URL of profile picture
    dateOfBirth: { type: Date }, // User's date of birth
    gender: { type: String, enum: ['Male', 'Female', 'Other'] }, // Gender field
    savedCards: [{
        cardNumber: { type: String, required: true },
        cardType: { type: String, enum: ['Visa', 'MasterCard', 'Amex', 'Other'] },
        expiryDate: { type: String, required: true },
        isDefault: { type: Boolean, default: false }
    }], // Saved card details
    shoppingPoints: { type: Number, default: 0 }, // User's shopping points
    created_at: { type: Date, default: Date.now }, // Account creation date
    updated_at: { type: Date, default: Date.now } // Last updated date
});

const UserDetails = mongoose.model('UserDetails', UserDetailsSchema);
module.exports = UserDetails;