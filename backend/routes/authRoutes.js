const express = require("express");
const router = express.Router();
const { register, login, getUser } = require("../controllers/authController");
const { auth } = require('../middleware/authMiddleware');

router.post("/signup", register);
router.post("/login", login);
router.get("/me", auth, getUser);

module.exports = router;
