const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/OrderController');

router.post('/create', OrderController.createOrder);
router.get('/', OrderController.getAllOrders);
router.get('/:id', OrderController.getOrderById);
router.get('/status/:status', OrderController.getOrdersByStatus);
router.put('/:id', OrderController.updateOrder);
router.delete('/:id', OrderController.deleteOrder);

module.exports = router;
