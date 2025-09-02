// // backend/routes/productRoutes.js
// const express = require("express");
// const router = express.Router();

// const productController = require("../controllers/productController");
// const { uploadAny } = require("../middleware/upload");
// const { auth, authUser } = require("../middleware/authMiddleware");
// const multer = require("multer");

// const requireAssignedVendor = require("../middleware/requireAssignedVendor");
// const assignVendorMiddleware = require("../middleware/assignVendorMiddleware");

// const mongoose = require("mongoose");
// const Product = require("../models/Product");
// const Vendor = require("../models/Vendor");

// const upload = multer({ dest: "uploads/tmp" });

// /**
//  * PUBLIC catalog routes (must come before any /:id)
//  */

// // All-products search (controller already vendor-aware when needed)
// router.get("/search", productController.searchProducts);

// // Mega menu helpers (not vendor-scoped)
// router.get("/catalog/categories", productController.listCategoriesPublic);
// router.get("/catalog/subcategories", productController.listSubcategoriesPublic);
// router.get("/catalog/groups", productController.listGroupsBySubcategory);
// router.get("/catalog/category-by-slug", productController.getCategoryBySlug);

// // Vendor-scoped list (assigns vendor for the day)
// router.get("/public", assignVendorMiddleware, productController.listProducts);

// // Vendor-scoped facets (requires an assignment already)
// router.get("/facets", requireAssignedVendor, productController.getFacets);

// /**
//  * Vendor-scoped product detail
//  * - Ensure an assignment exists
//  * - Normalize to both vendor._id and vendor.user_id
//  * - Return product only if it belongs to today’s vendor
//  */
// router.get("/public/:id", assignVendorMiddleware, async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ message: "Invalid product id" });
//     }

//     // We may have only one of these set depending on middleware
//     let { assignedVendorId, assignedVendorUserId } = req;

//     if (!assignedVendorId && !assignedVendorUserId) {
//       return res.status(400).json({ message: "Assigned vendor missing" });
//     }

//     // If only user_id is present, fetch the vendor doc to get _id as well
//     let vendorDoc = null;
//     if (!assignedVendorId && assignedVendorUserId) {
//       vendorDoc = await Vendor.findOne({
//         user_id: assignedVendorUserId,
//       }).lean();
//       if (vendorDoc) assignedVendorId = vendorDoc._id?.toString();
//     }

//     // If only _id is present, fetch to get user_id
//     if (assignedVendorId && !assignedVendorUserId) {
//       vendorDoc = await Vendor.findById(assignedVendorId).lean();
//       if (vendorDoc) assignedVendorUserId = vendorDoc.user_id?.toString();
//     }

//     // Build allowed seller keys set
//     const allowedSellerKeys = new Set(
//       [
//         assignedVendorId,
//         assignedVendorUserId,
//         vendorDoc?._id?.toString(),
//         vendorDoc?.user_id?.toString(),
//       ].filter(Boolean)
//     );

//     // Load product
//     const product = await Product.findById(id)
//       .populate("category_id subcategory_id variants seller_id")
//       .lean();

//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     // product.seller_id may be ObjectId or populated doc
//     const sellerKey =
//       (product.seller_id && product.seller_id._id?.toString()) ||
//       (product.seller_id &&
//         product.seller_id.toString &&
//         product.seller_id.toString()) ||
//       product.vendor_id?.toString?.() ||
//       product.seller_user_id?.toString?.();

//     if (!sellerKey || !allowedSellerKeys.has(sellerKey)) {
//       return res
//         .status(404)
//         .json({ message: "Product not available from your vendor today" });
//     }

//     return res.status(200).json(product);
//   } catch (err) {
//     console.error("public product detail error:", err);
//     return res.status(500).json({ message: "Failed to load product" });
//   }
// });

// /**
//  * ADMIN / AUTH routes
//  */
// router.post("/import", authUser, uploadAny, productController.importProducts);
// router.post("/", authUser, uploadAny, productController.createProduct);

// // Read (admin/internal)
// router.get("/", authUser, productController.getAllProducts);
// router.get(
//   "/nearbyseller",
//   authUser,
//   productController.getNearbySellerProducts
// );
// router.get("/export", productController.exportProducts);
// router.get("/filter", productController.getProductByFilter);
// router.get("/tags", productController.getAllProductTags);
// router.get(
//   "/catalog/product-names",
//   productController.listProductNamesBySubcategory
// );

// // Public lookups by taxonomy/seller (legacy)
// router.get("/category/:categoryId", productController.getProductsByCategoryId);
// router.get(
//   "/subcategory/:subcategoryId",
//   productController.getProductsBySubCategoryId
// );
// router.get("/seller/:sellerId", productController.getProductsBySellerId);

// // Keep last so it doesn't shadow other GETs
// router.get("/:id", requireAssignedVendor, productController.getProductById);

// router.put("/:id", auth, uploadAny, productController.updateProduct);
// router.delete("/:id", auth, productController.deleteProduct);

// module.exports = router;
// backend/routes/productRoutes.js
const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");
const { uploadAny } = require("../middleware/upload");
const { auth, authUser } = require("../middleware/authMiddleware");

const assignVendorMiddleware = require("../middleware/assignVendorMiddleware");
const requireAssignedVendor = require("../middleware/requireAssignedVendor"); // keep if you already have it

const mongoose = require("mongoose");
const Product = require("../models/Product");
const Vendor = require("../models/Vendor");

// ---------- PUBLIC CATALOG (put BEFORE any "/:id") ----------
router.get("/search", productController.searchProducts);

router.get("/catalog/categories", productController.listCategoriesPublic);
router.get("/catalog/subcategories", productController.listSubcategoriesPublic);
router.get("/catalog/groups", productController.listGroupsBySubcategory);
router.get("/catalog/category-by-slug", productController.getCategoryBySlug);

// Vendor-scoped list
router.get("/public", assignVendorMiddleware, productController.listProducts);

// Vendor-scoped facets
router.get("/facets", assignVendorMiddleware, productController.getFacets);

/**
 * Vendor-scoped product detail
 * - DO NOT populate seller_id (it stores Vendor _id in your JSON)
 * - Normalize assignment to both vendor _id and user_id
 * - 404 if product.seller_id doesn't belong to today's vendor
 */
router.get("/public/:id", assignVendorMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    let { assignedVendorId, assignedVendorUserId } = req;
    if (!assignedVendorId && !assignedVendorUserId) {
      return res.status(400).json({ message: "Assigned vendor missing" });
    }

    // fetch vendor doc if needed so we always have both ids
    let vDoc = null;
    if (!assignedVendorId && assignedVendorUserId) {
      vDoc = await Vendor.findOne({ user_id: assignedVendorUserId }).lean();
      if (vDoc) assignedVendorId = vDoc._id?.toString();
    }
    if (assignedVendorId && !assignedVendorUserId) {
      vDoc = await Vendor.findById(assignedVendorId).lean();
      if (vDoc) assignedVendorUserId = vDoc.user_id?.toString();
    }

    const allowed = new Set(
      [assignedVendorId, assignedVendorUserId, vDoc?._id?.toString(), vDoc?.user_id?.toString()].filter(Boolean)
    );

    // NOTE: DO NOT populate seller_id
    const product = await Product.findById(id)
      .populate("category_id subcategory_id variants")
      .lean();

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const sellerKey =
      product.seller_id?.toString?.() ||
      product.vendor_id?.toString?.() ||
      product.seller_user_id?.toString?.();

    if (!sellerKey || !allowed.has(sellerKey)) {
      return res
        .status(404)
        .json({ message: "Product not available from your vendor today" });
    }

    return res.status(200).json(product);
  } catch (err) {
    console.error("public product detail error:", err);
    return res.status(500).json({ message: "Failed to load product" });
  }
});

// ---------- ADMIN / INTERNAL ----------
router.post("/import", authUser, uploadAny, productController.importProducts);
router.post("/", authUser, uploadAny, productController.createProduct);

router.get("/", authUser, productController.getAllProducts);
router.get("/nearbyseller", authUser, productController.getNearbySellerProducts);
router.get("/export", productController.exportProducts);
router.get("/filter", productController.getProductByFilter);
router.get("/tags", productController.getAllProductTags);
router.get("/catalog/product-names", productController.listProductNamesBySubcategory);

router.get("/category/:categoryId", productController.getProductsByCategoryId);
router.get("/subcategory/:subcategoryId", productController.getProductsBySubCategoryId);
router.get("/seller/:sellerId", productController.getProductsBySellerId);
// add once in productRoutes.js for debugging:
router.get("/debug/assigned", assignVendorMiddleware, (req, res) => {
  res.json({
    pincode: req._resolvedPincode,
    dateKey: req._dateKey,
    assignedVendorId: req.assignedVendorId,
    assignedVendorUserId: req.assignedVendorUserId,
  });
});
// Keep last
router.get("/:id", requireAssignedVendor, productController.getProductById);
router.put("/:id", auth, uploadAny, productController.updateProduct);
router.delete("/:id", auth, productController.deleteProduct);


module.exports = router;
