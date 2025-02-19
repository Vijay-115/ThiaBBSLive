const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { uploadFields } = require('../middleware/upload');
const { auth, adminOnly } = require('../middleware/authMiddleware');

// Create product with image upload
router.post("/products", auth, uploadFields, productController.createProduct);
// READ: Get all products
router.get('/products', productController.getAllProducts);

// READ: Get a single product by ID
router.get('/products/:id', productController.getProductById);

// Update product with image upload
router.put(
    '/products/:id',
    auth,
    uploadFields, // Accept up to 5 images
    productController.updateProduct
);

// DELETE: Delete a product by ID
router.delete('/products/:id', auth, productController.deleteProduct);

module.exports = router;