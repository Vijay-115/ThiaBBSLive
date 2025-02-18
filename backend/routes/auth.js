const express = require('express');
const { register, login, sendPasswordResetEmail, resetPassword, logout, checkAuth } = require('../controllers/authController');
const { auth } = require("../middleware/authMiddleware");
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post("/forgot-password", sendPasswordResetEmail);
router.post("/reset-password/:token", resetPassword);
router.post("/logout", auth, logout);
router.get("/check-auth", auth, checkAuth);

module.exports = router;