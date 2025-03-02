const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const {auth} = require("../middleware/authMiddleware"); // To protect routes

router.get("/",cartController.getCartItems);
router.post("/add",cartController.addToCart);
router.put("/update",cartController.updateQuantity);
router.delete("/remove/:productId",cartController.removeFromCart);
router.delete("/clear",cartController.clearCart);

module.exports = router;
