const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { uploadFields } = require('../middleware/upload');
const { auth, adminOnly } = require('../middleware/authMiddleware');

// Create product with image upload
router.post("/", auth, uploadFields, productController.createProduct);
// READ: Get all products
router.get('/', productController.getAllProducts);

// READ: Get a single product by ID
router.get('/:id', productController.getProductById);

// Update product with image upload
router.put(
    '/:id',
    auth,
    uploadFields, // Accept up to 5 images
    productController.updateProduct
);

// DELETE: Delete a product by ID
router.delete('/:id', auth, productController.deleteProduct);

module.exports = router;