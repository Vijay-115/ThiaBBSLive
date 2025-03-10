const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/OrderController');
const { auth, adminOnly } = require('../middleware/authMiddleware');

router.post('/orders/', auth, OrderController.createOrder);
router.post('/verify-payment/', auth, OrderController.verifyPayment);
router.get('/orders/', OrderController.getAllOrders);
router.get('/orders/:id', OrderController.getOrderById);
router.get('/orders/status/:status', OrderController.getOrdersByStatus);
router.put('/orders/:id', OrderController.updateOrder);
router.delete('/orders/:id', OrderController.deleteOrder);

module.exports = router;
