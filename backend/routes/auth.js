const express = require('express');
const { register, login, sendPasswordResetEmail, resetPassword, logout, checkAuth, getUserInfo, updateProfile } = require('../controllers/authController');
const { auth } = require("../middleware/authMiddleware");
const { uploadAny } = require('../middleware/upload');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post("/forgot-password", sendPasswordResetEmail);
router.post("/reset-password/:token", resetPassword);
router.post("/logout", auth, logout);
router.get("/check-auth", auth, checkAuth);
router.put("/update-profile", uploadAny, updateProfile);
router.get("/user-info", auth, getUserInfo);
router.post("/refresh-token", async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ success: false, message: "Refresh token required" });

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const newAccessToken = jwt.sign({ userId: decoded.userId }, process.env.JWT_SECRET, { expiresIn: "15m" });

        res.json({ success: true, accessToken: newAccessToken });
    } catch (error) {
        return res.status(403).json({ success: false, message: "Invalid refresh token" });
    }
});

module.exports = router;