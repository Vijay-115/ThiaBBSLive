const express = require("express");
const router = express.Router();

const fhController = require("../controllers/franchiseHeadController");

// reuse your existing upload loader logic
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

function assert(fn, name) {
  if (typeof fn !== "function") {
    throw new Error(`Missing function: ${name} is ${typeof fn}.`);
  }
}
assert(fhController.uploadOCR, "franchiseHeadController.uploadOCR");
assert(fhController.saveStepByKey, "franchiseHeadController.saveStepByKey");

router.get("/", (req, res) =>
  res.json({ ok: true, msg: "franchise-head root" })
);

// OCR
if (!upload || typeof upload.single !== "function") {
  router.post("/ocr", (req, res) => {
    res
      .status(500)
      .json({ ok: false, message: "Upload middleware not found." });
  });
} else {
  router.post("/ocr", upload.single("document"), fhController.uploadOCR);
}

// save-by-key
router.post("/step-by-key", fhController.saveStepByKey);
router.patch("/step-by-key", fhController.saveStepByKey);

// legacy step (kept)
router.patch("/:vendorId/step", fhController.saveStep);

// GST (manual + file)
router.put("/gst", upload.single("document"), fhController.updateGst);

// Bank
router.put("/bank", upload.single("document"), fhController.updateBankDetails);
router.put(
  "/:vendorId/bank",
  upload.single("document"),
  fhController.updateBankByParam
);

// Outlet nameboard image
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
  fhController.updateOutlet
);

module.exports = router;
