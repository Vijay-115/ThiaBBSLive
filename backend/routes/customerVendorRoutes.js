const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/customerVendorController");

// reuse your existing upload middleware if present
let uploadModule;
try {
  uploadModule = require("../middleware/upload");
} catch (e) {
  try {
    uploadModule = require("../upload");
  } catch (e2) {
    uploadModule = null;
  }
}
const upload = uploadModule?.upload || uploadModule;

router.get("/", (req, res) =>
  res.json({ ok: true, msg: "customer-vendor root" })
);

// OCR (single file field: document)
if (!upload || typeof upload.single !== "function") {
  router.post("/ocr", (req, res) =>
    res.status(500).json({ ok: false, message: "Upload middleware not found." })
  );
} else {
  router.post("/ocr", upload.single("document"), ctrl.uploadOCR);
}

// step-by-key
router.post("/step-by-key", ctrl.saveStepByKey);
router.patch("/step-by-key", ctrl.saveStepByKey);

// legacy step
router.patch("/:vendorId/step", ctrl.saveStep);

// GST
router.put("/gst", upload.single("document"), ctrl.updateGst);

// Bank
router.put(
  "/:vendorId/bank",
  upload.single("document"),
  ctrl.updateBankByParam
);

// Outlet nameboard upload (image only)
const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(
      null,
      Date.now() +
        "-" +
        Math.round(Math.random() * 1e9) +
        path.extname(file.originalname)
    ),
});
const uploadOutlet = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png/;
    const ext = path.extname(file.originalname).toLowerCase();
    const ok = allowed.test(ext) && allowed.test(file.mimetype);
    cb(ok ? null : new Error("Only JPG, JPEG, PNG allowed"), ok);
  },
});
router.put(
  "/outlet",
  uploadOutlet.single("outlet_nameboard_image"),
  ctrl.updateOutlet
);

// Register
router.post("/register", ctrl.registerCustomerVendor);

module.exports = router;
