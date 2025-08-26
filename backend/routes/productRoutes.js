const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");
const { uploadAny } = require("../middleware/upload");
const { auth, authUser } = require("../middleware/authMiddleware");
const multer = require("multer");

const upload = multer({ dest: "uploads/tmp" });

/**
 * PUBLIC catalog for storefront
 * These must come FIRST and /:id must stay LAST.
 */
router.get("/catalog/categories", productController.listCategoriesPublic);
router.get("/catalog/subcategories", productController.listSubcategoriesPublic);
router.get("/catalog/groups", productController.listGroupsBySubcategory); // <— add this
router.get("/catalog/category-by-slug", productController.getCategoryBySlug);

router.get("/public", productController.listProducts); // product list with filters
router.get("/facets", productController.getFacets); // brand/price facets
router.post(
  "/catalog/import/categories",
  authUser,
  upload.fields([{ name: "csv", maxCount: 1 }]),
  productController.importCategoriesCSV
);

// CSV for sub-categories
router.post(
  "/catalog/import/subcategories",
  authUser,
  upload.fields([{ name: "csv", maxCount: 1 }]),
  productController.importSubcategoriesCSV
);

// CSV for products (+ optional images zip)
router.post(
  "/import/csv",
  authUser,
  upload.fields([
    { name: "csv", maxCount: 1 },
    { name: "images", maxCount: 1 },
  ]),
  productController.importProductsCSV
);

/**
 * ADMIN / AUTH routes
 */
router.post("/import", authUser, uploadAny, productController.importProducts);
router.post("/", authUser, uploadAny, productController.createProduct);

// Read (admin)
router.get("/", authUser, productController.getAllProducts);
router.get(
  "/nearbyseller",
  authUser,
  productController.getNearbySellerProducts
);
router.get("/export", productController.exportProducts);
router.get("/filter", productController.getProductByFilter);
router.get("/tags", productController.getAllProductTags);

router.get(
  "/catalog/product-names",
  productController.listProductNamesBySubcategory
);
// Public lookups by taxonomy/seller
router.get("/category/:categoryId", productController.getProductsByCategoryId);
router.get(
  "/subcategory/:subcategoryId",
  productController.getProductsBySubCategoryId
);
router.get("/seller/:sellerId", productController.getProductsBySellerId);

// Product detail MUST be last so it doesn't shadow other routes
router.get("/:id", productController.getProductById);

// Update (single)
router.put("/:id", auth, uploadAny, productController.updateProduct);

// Delete (single)
router.delete("/:id", auth, productController.deleteProduct);

module.exports = router;
