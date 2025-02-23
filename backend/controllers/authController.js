const User = require("../models/User");
const UserDetails = require("../models/UserDetails");
const Cart = require("../models/Cart");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const nodemailer = require("nodemailer");
const redis = require("redis");
const crypto = require('crypto');

const client = redis.createClient();
client.connect().catch(console.error);

// Function to generate a 7-digit alphanumeric referral code
const generateReferralCode = () => {
    return crypto.randomBytes(4).toString('hex').toUpperCase().slice(0, 7);
};

// Register user
exports.register = async (req, res) => {
    const { name, email, phone, password, referredBy } = req.body;

    try {
        // ✅ Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: "User already exists" });
        }

        // ✅ Validate Referral Code
        let referrer = null;
        if (referredBy) {
            referrer = await UserDetails.findOne({ referralCode: referredBy });
            if (!referrer) {
                return res.status(400).json({ msg: "Invalid referral code" });
            }
        }

        // ✅ Generate unique referral code
        const referralCode = generateReferralCode();

        // ✅ Create new user
        user = new User({ name, email, phone, password });

        // ✅ Hash the password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // ✅ Save user to the database
        await user.save();

        // ✅ Create UserDetails record
        const userDetails = new UserDetails({
            userId: user._id,
            referralCode,
            referredBy: referrer ? referrer.userId : null, // Save referrer if valid
            phone
        });

        await userDetails.save();

        // ✅ Link User to UserDetails
        user.userdetails = userDetails._id;
        await user.save();

        // ✅ Merge guest cart with registered user cart (if applicable)
        if (req.session.userId) {
            await mergeGuestCartWithUser(req.session.userId, user._id);
            req.session.userId = null; // Clear session cart after merging
        }

        // ✅ Generate Access Token (Short Expiry)
        const accessToken = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // ✅ Generate Refresh Token (Longer Expiry)
        const refreshToken = jwt.sign(
            { userId: user._id },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "7d" }
        );

        // ✅ Send response with tokens and user data
        res.status(201).json({
            accessToken,
            refreshToken,
            user,
            userDetails
        });

    } catch (error) {
        console.error("Registration error:", error);
        if (error.code === 11000) { // MongoDB duplicate key error
            return res.status(400).json({ msg: "User already exists" });
        }
        res.status(500).json({ msg: "Server error", error: error.message });
    }
};

// Login controller
exports.login = async (req, res) => {
    const { email, password } = req.body;

    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Check if the user exists
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Compare the provided password with the stored hash
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // ✅ Merge guest cart with logged-in user cart (if applicable)
        if (req.session.userId) {
            await mergeGuestCartWithUser(req.session.userId, user._id);
            req.session.userId = null; // Clear session cart after merging
        }

        // ✅ Generate Access Token (Short Expiry)
        const accessToken = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // Access token valid for 1 hour
        );

        // ✅ Generate Refresh Token (Longer Expiry)
        const refreshToken = jwt.sign(
            { userId: user._id },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '7d' } // Refresh token valid for 7 days
        );

        // ✅ Store refreshToken securely in the database
        user.refreshToken = refreshToken;
        await user.save();

        // ✅ Send response with tokens and user data
        res.status(200).json({
            accessToken,
            refreshToken,
            user,
        });

    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// ✅ Function to merge guest cart with logged-in user cart
const mergeGuestCartWithUser = async (sessionUserId, realUserId) => {
    try {
        const sessionCart = await Cart.find({ user: sessionUserId });
        const userCart = await Cart.find({ user: realUserId });

        for (const sessionItem of sessionCart) {
            const existingItem = userCart.find(item => item.product.toString() === sessionItem.product.toString());

            if (existingItem) {
                // ✅ If product already in user’s cart, update quantity
                existingItem.quantity += sessionItem.quantity;
                await existingItem.save();
            } else {
                // ✅ If new product, assign it to the logged-in user
                await Cart.create({
                    user: realUserId,
                    product: sessionItem.product,
                    quantity: sessionItem.quantity,
                    cart_id: new mongoose.Types.ObjectId().toString()
                });
            }
        }

        // ✅ Remove session cart after merging
        await Cart.deleteMany({ user: sessionUserId });
    } catch (error) {
        console.error("Error merging guest cart:", error);
    }
};

exports.sendPasswordResetEmail = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        // Generate a password reset token (e.g., JWT with a short expiration)
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });

        // Configure email transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const resetLink = `${process.env.REACT_APP_CLI_URL}/reset-password/${token}`;
        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: "Password Reset Request",
            html: `
            <div style="font-family: Montserrat, sans-serif; line-height: 1.6;">
                <h2 style="color: #333;">Password Reset Request</h2>
                <p>Hello,</p>
                <p>We received a request to reset your password. Click the button below to reset it:</p>
                <a href="${resetLink}" style="display: inline-block; padding: 10px 15px; font-size: 16px; color: #fff; background-color: #4CAF50; text-decoration: none; border-radius: 5px;">Reset Password</a>
                <p>If you didn't request this, please ignore this email or contact support if you have questions.</p>
                <p>Thank you!</p>
                <p><strong>Your App Team</strong></p>
                <hr>
                <p style="font-size: 12px; color: #555;">If the button above doesn't work, copy and paste the following URL into your browser:</p>
                <p style="font-size: 12px; color: #555;">${resetLink}</p>
            </div>
            `,
        });
        

        res.status(200).json({ message: "Password reset email sent" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Hash the new password and update it
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
        res.status(400).json({ message: "Invalid or expired token" });
    }
};

// Logout user (Blacklist Token)
exports.logout = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(400).json({ message: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const expiry = decoded.exp ? decoded.exp - Math.floor(Date.now() / 1000) : 86400; // 24-hour expiry fallback

        await client.setEx(token, expiry, "blacklisted");

        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Check if user is logged in
exports.checkAuth = async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        const isBlacklisted = await client.get(token);
        if (isBlacklisted) {
            return res.status(401).json({ message: "Token expired. Please login again" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.status(200).json({ userId: decoded.userId, role: decoded.role });
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};

// Get User Info
exports.getUserInfo = async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userInfo = await User.findById(decoded.userId)
        .populate("userdetails");
        res.status(200).json({ userInfo });
    } catch (error) {
        console.error("Error fetching user info:", error);
        res.status(401).json({ message: "Invalid token" });
    }
};
