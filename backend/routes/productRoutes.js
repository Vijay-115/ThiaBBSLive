const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// CREATE: Add a new product
router.post('/products', productController.createProduct);

// READ: Get all products
router.get('/products', productController.getAllProducts);

// READ: Get a single product by ID
router.get('/products/:id', productController.getProductById);

// UPDATE: Update a product by ID
router.put('/products/:id', productController.updateProduct);

// DELETE: Delete a product by ID
router.delete('/products/:id', productController.deleteProduct);

module.exports = router;