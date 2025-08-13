// // routes/vendorRoutes.js
// const express = require("express");
// const router = express.Router();
// const vendorController = require("../controllers/vendorController");
// const { upload } = require("../middleware/upload");

// // OCR (PAN / Aadhaar). Field name must be 'document'. Accepts JPG/JPEG/PNG/PDF.
// router.post("/ocr", upload.single("document"), vendorController.uploadOCR);


// // ✅ Upsert WITHOUT vendorId
// router.patch("/step-by-key", vendorController.saveStepByKey);
// router.post("/step-by-key", vendorController.saveStepByKey); // <- add this too

// // (Optional) Old patterns — keep if you still use them elsewhere
// router.patch("/:vendorId/step", vendorController.saveStep);
// router.post("/", vendorController.createVendor);

// // Health check
// router.get("/", (req, res) => res.json({ ok: true, msg: "vendors root" }));

// module.exports = router;


// routes/vendorRoutes.js
const express = require("express");
const router = express.Router();

// Controller
const vendorController = require("../controllers/vendorController");

// Multer upload middleware (project setups vary)
// Try middleware/upload first, fall back to upload.js at project root
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
const upload = uploadModule?.upload || uploadModule; // support `module.exports = upload` or `{ upload }`

// Sanity checks (will help if something is still off)
function assert(fn, name) {
  if (typeof fn !== "function") {
    throw new Error(`Missing function: ${name} is ${typeof fn}. Check your imports/exports.`);
  }
}
assert(vendorController.uploadOCR, "vendorController.uploadOCR");
assert(vendorController.saveStepByKey, "vendorController.saveStepByKey");

// Root probe
router.get("/", (req, res) => res.json({ ok: true, msg: "vendors root" }));

// OCR endpoint: requires a file field named "document"
if (!upload || typeof upload.single !== "function") {
  // Give a clear error rather than crashing at route binding
  router.post("/ocr", (req, res) => {
    res.status(500).json({ ok: false, message: "Upload middleware not found. Check middleware/upload.js or upload.js." });
  });
} else {
  router.post("/ocr", upload.single("document"), vendorController.uploadOCR);
}
// GST certificate upload endpoint
// Save without vendorId (upsert by PAN or Aadhaar)
router.post("/step-by-key", vendorController.saveStepByKey);
router.patch("/step-by-key", vendorController.saveStepByKey);

// Optional legacy route (only if you still call it somewhere)
router.patch("/:vendorId/step", vendorController.saveStep);
// GST manual upload + fields (no OCR)
// GST upload + manual fields (NO OCR) — MUST BE PUT to match your frontend
router.put("/gst", upload.single("document"), vendorController.updateGst);
// Add route for updating bank details
router.put("/bank", upload.single("document"), vendorController.updateBankDetails);
// Added new route for updating bank details with vendorId in the URL
router.put("/:vendorId/bank", upload.single("document"), vendorController.updateBankByParam);

// Image upload for outlet nameboard
const multer = require("multer");
const path = require("path");

// storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const uploadOutlet = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png/;
    const ext = path.extname(file.originalname).toLowerCase();
    const mime = file.mimetype;
    if (allowed.test(ext) && allowed.test(mime)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG, JPEG, PNG allowed"));
    }
  },
});

router.put(
  "/outlet",
  uploadOutlet.single("outlet_nameboard_image"),
  vendorController.updateOutlet
);

module.exports = router;
