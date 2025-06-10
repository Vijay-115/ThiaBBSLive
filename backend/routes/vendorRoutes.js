const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorController');
const { uploadAny } = require('../middleware/upload');

// Variant Routes
router.post('/register', uploadAny, vendorController.registerVendor);
router.put('/approve/:id', uploadAny, vendorController.approveVendor);
router.put('/decline/:id', uploadAny, vendorController.declineVendor);
router.get('/get-request', vendorController.getRequest);

module.exports = router;
