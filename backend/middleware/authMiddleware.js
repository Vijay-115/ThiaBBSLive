const jwt = require("jsonwebtoken");
const redis = require("redis");

const client = redis.createClient();
client.connect().catch(console.error);

// Authentication Middleware
const auth = async (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token, authorization denied" });

    try {
        const isBlacklisted = await client.get(token);
        if (isBlacklisted) {
            return res.status(401).json({ message: "Token expired. Please login again" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ message: "Token is not valid" });
    }
};

// Admin-Only Middleware
const adminOnly = (req, res, next) => {
    if (req.user?.role !== "admin") {
        return res.status(403).json({ message: "Access denied" });
    }
    next();
};

module.exports = { auth, adminOnly };
