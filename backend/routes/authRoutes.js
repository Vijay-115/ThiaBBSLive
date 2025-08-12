const express = require('express');
const { register, login, sendPasswordResetEmail, resetPassword, logout, checkAuth, updateProfile, getUser, authRefershToken } = require('../controllers/authController');
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
router.get("/me", getUser);
router.post("/refresh-token", authRefershToken);

module.exports = router;
