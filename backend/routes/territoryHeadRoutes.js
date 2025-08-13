const express = require("express");
const router = express.Router();
const thController = require("../controllers/territoryHeadController");

// try to reuse the same upload middleware you use elsewhere
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

// sanity check
function assert(fn, name) {
  if (typeof fn !== "function") {
    throw new Error(`Missing function: ${name}`);
  }
}
assert(thController.uploadOCR, "territoryHeadController.uploadOCR");
assert(thController.saveStepByKey, "territoryHeadController.saveStepByKey");

router.get("/", (req, res) =>
  res.json({ ok: true, msg: "territory-head root" })
);

// OCR
if (!upload || typeof upload.single !== "function") {
  router.post("/ocr", (req, res) =>
    res.status(500).json({ ok: false, message: "Upload middleware not found." })
  );
} else {
  router.post("/ocr", upload.single("document"), thController.uploadOCR);
}

// step-by-key (JSON)
router.post("/step-by-key", thController.saveStepByKey);
router.patch("/step-by-key", thController.saveStepByKey);

// legacy step (optional)
router.patch("/:vendorId/step", thController.saveStep);

// GST
router.put("/gst", upload.single("document"), thController.updateGst);

// Bank
router.put(
  "/:vendorId/bank",
  upload.single("document"),
  thController.updateBankByParam
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
  thController.updateOutlet
);

module.exports = router;
