const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { uploadAny } = require('../middleware/upload');
const { auth, authUser } = require('../middleware/authMiddleware');

// Create product with image upload
router.post("/", authUser, uploadAny, productController.createProduct);
// READ: Get all products
router.get('/',authUser, productController.getAllProducts);
router.get('/nearbyseller',authUser, productController.getNearbySellerProducts);

// READ: Get a single product by ID
router.get("/filter", productController.getProductByFilter);
router.get("/tags", productController.getAllProductTags);
router.get('/category/:categoryId', productController.getProductsByCategoryId);
router.get('/subcategory/:subcategoryId', productController.getProductsBySubCategoryId);
router.get('/seller/:sellerId', productController.getProductsBySellerId);
router.get('/:id', productController.getProductById);

// Update product with image upload
router.put(
    '/:id',
    auth,
    uploadAny, // Accept up to 5 images
    productController.updateProduct
);

// DELETE: Delete a product by ID
router.delete('/:id', auth, productController.deleteProduct);

module.exports = router;