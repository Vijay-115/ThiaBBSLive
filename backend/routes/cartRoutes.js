const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const {auth} = require("../middleware/authMiddleware"); // To protect routes

router.get("/", auth, cartController.getCartItems);
router.post("/add", auth, cartController.addToCart);
router.put("/update", auth, cartController.updateQuantity);
router.delete("/remove/:productId", auth, cartController.removeFromCart);
router.delete("/clear", auth, cartController.clearCart);

module.exports = router;
