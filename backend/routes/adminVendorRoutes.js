const express = require("express");
const router = express.Router();
const { auth, adminOnly } = require("../middleware/authMiddleware");
const {
  createVendorCredentials,
  seedPincodeVendors,
  listVendors,
  approveVendorRequest,
  getVendorById,
  resendVendorCredentials,
} = require("../controllers/adminVendorsController");

// Debug
console.log("auth:", auth);
console.log("adminOnly:", adminOnly);

// Apply middleware globally
router.use(auth, adminOnly);

// Routes
router.get("/vendors", listVendors);
router.get("/vendors/:id", getVendorById);

// Approve a vendor
router.post("/vendors/:id/approve", approveVendorRequest);

// Credential flows (use :id consistently)
router.post("/vendors/:id/create-credentials", createVendorCredentials);
router.post("/vendors/:id/resend-credentials", resendVendorCredentials);

// router.post("/seed/pincode-vendors", seedPincodeVendors);
router.post("/seed-pincode-vendors", seedPincodeVendors);

module.exports = router;
