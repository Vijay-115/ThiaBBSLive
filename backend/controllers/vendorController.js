// controllers/vendorController.js
const mongoose = require("mongoose");
const Vendor = require("../models/Vendor");
const path = require("path");

/**
 * Generic file upload handler (no OCR).
 * Expects multer to have placed the file at req.file.
 * Returns a stable /uploads/<filename> URL.
 */
exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ ok: false, message: "No file uploaded" });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    return res.json({ ok: true, fileUrl });
  } catch (e) {
    console.error("uploadDocument error:", e);
    return res
      .status(500)
      .json({ ok: false, message: "Upload failed", details: e.message });
  }
};

/**
 * Save arbitrary step payloads. Upserts vendor if needed.
 * Body may include:
 * - vendorId (optional)
 * - pan_number, pan_pic
 * - vendor_fname, vendor_lname, dob
 * - aadhar_number, aadhar_pic_front, aadhar_pic_back
 * - register_business_address: { street, city, state, country, postalCode }
 */
exports.saveStepByKey = async (req, res) => {
  try {
    const b = req.body || {};
    const id =
      b.vendorId && mongoose.Types.ObjectId.isValid(b.vendorId)
        ? b.vendorId
        : new mongoose.Types.ObjectId();

    const set = { updated_at: new Date() };

    // Identity
    if (b.vendor_fname) set.vendor_fname = String(b.vendor_fname).trim();
    if (b.vendor_lname) set.vendor_lname = String(b.vendor_lname).trim();
    if (b.dob) set.dob = String(b.dob).trim();

    // PAN
    if (b.pan_number)
      set.pan_number = String(b.pan_number).trim().toUpperCase();
    if (b.pan_pic) set.pan_pic = String(b.pan_pic).trim();

    // Aadhaar
    if (b.aadhar_number) set.aadhar_number = String(b.aadhar_number).trim();
    if (b.aadhar_pic_front)
      set.aadhar_pic_front = String(b.aadhar_pic_front).trim();
    if (b.aadhar_pic_back)
      set.aadhar_pic_back = String(b.aadhar_pic_back).trim();

    // Registered/Business address
    if (
      b.register_business_address &&
      typeof b.register_business_address === "object"
    ) {
      const addr = b.register_business_address;
      ["street", "city", "state", "country", "postalCode"].forEach((k) => {
        const v = addr[k];
        if (v !== undefined && v !== null && String(v).trim() !== "") {
          set[`register_business_address.${k}`] = String(v).trim();
        }
      });
    }

    const doc = await Vendor.findOneAndUpdate(
      { _id: id },
      { $set: set },
      {
        new: true,
        upsert: true, // create if not exists
        setDefaultsOnInsert: true,
        runValidators: false, // skip required validators for partial steps
      }
    );

    return res.json({ ok: true, data: doc });
  } catch (e) {
    console.error("saveStepByKey error:", e);
    return res
      .status(500)
      .json({ ok: false, message: "Save failed", details: e.message });
  }
};

/**
 * Optional legacy route: PATCH /:vendorId/step
 */
exports.saveStep = async (req, res) => {
  try {
    const { vendorId } = req.params;
    if (!vendorId)
      return res.status(400).json({ ok: false, message: "Vendor ID required" });

    const set = { ...(req.body || {}), updated_at: new Date() };
    const doc = await Vendor.findByIdAndUpdate(
      vendorId,
      { $set: set },
      { new: true, runValidators: false }
    );
    if (!doc)
      return res.status(404).json({ ok: false, message: "Vendor not found" });
    return res.json({ ok: true, data: doc });
  } catch (e) {
    console.error("saveStep error:", e);
    return res
      .status(500)
      .json({ ok: false, message: "Save failed", details: e.message });
  }
};

/**
 * PUT /gst  (multipart/form-data)
 * Accepts vendorId in body, optional file at field "document".
 * Also accepts gst_number, gst_legal_name, gst_constitution,
 * and gst_address fields (either nested or bracket notation).
 */
exports.updateGst = async (req, res) => {
  try {
    const b = req.body || {};
    const vendorId = (b.vendorId || "").trim();
    if (!vendorId) {
      return res.status(400).json({ ok: false, message: "vendorId required" });
    }

    const set = { updated_at: new Date() };

    if (req.file) {
      set.gst_cert_pic = `/uploads/${req.file.filename}`;
    }

    if (b.gst_number)
      set.gst_number = String(b.gst_number).trim().toUpperCase();
    if (b.gst_legal_name) set.gst_legal_name = String(b.gst_legal_name).trim();
    if (b.gst_constitution)
      set.gst_constitution = String(b.gst_constitution).trim();

    const g = b.gst_address || {};
    const keys = [
      "floorNo",
      "buildingNo",
      "street",
      "locality",
      "city",
      "district",
      "state",
      "postalCode",
    ];
    for (const k of keys) {
      const v = g[k] ?? b[`gst_address[${k}]`];
      if (v !== undefined && v !== null && String(v).trim() !== "") {
        set[`gst_address.${k}`] = String(v).trim();
      }
    }

    const updated = await Vendor.findByIdAndUpdate(
      vendorId,
      { $set: set },
      { new: true, runValidators: false }
    );
    if (!updated)
      return res.status(404).json({ ok: false, message: "Vendor not found" });

    return res.json({ ok: true, data: updated });
  } catch (e) {
    console.error("updateGst error:", e);
    return res
      .status(500)
      .json({ ok: false, message: "GST update failed", details: e.message });
  }
};

/**
 * PUT /bank and PUT /:vendorId/bank  (multipart/form-data)
 * Accepts vendorId via req.params or req.body, optional file at "document".
 */
exports.updateBankDetails = async (req, res) => {
  try {
    const vendorId = req.params.vendorId || req.body.vendorId;
    if (!vendorId) {
      return res
        .status(400)
        .json({ ok: false, message: "Vendor ID is required" });
    }

    const set = { updated_at: new Date() };

    if (req.file) {
      set.cancel_cheque_passbook = `/uploads/${req.file.filename}`;
    }

    const b = req.body || {};
    if (b.account_holder_name)
      set.account_holder_name = String(b.account_holder_name).trim();
    if (b.account_no) set.account_no = String(b.account_no).trim();
    if (b.ifcs_code) set.ifcs_code = String(b.ifcs_code).trim().toUpperCase();
    if (b.bank_name) set.bank_name = String(b.bank_name).trim();
    if (b.branch_name) set.branch_name = String(b.branch_name).trim();
    if (b.bank_address) set.bank_address = String(b.bank_address).trim();

    const updated = await Vendor.findByIdAndUpdate(
      vendorId,
      { $set: set },
      { new: true, runValidators: false }
    );
    if (!updated)
      return res.status(404).json({ ok: false, message: "Vendor not found" });

    return res.json({ ok: true, data: updated });
  } catch (e) {
    console.error("updateBank error:", e);
    return res
      .status(500)
      .json({ ok: false, message: "Bank update failed", details: e.message });
  }
};

exports.updateBankByParam = async (req, res) => {
  req.body = req.body || {};
  req.body.vendorId = req.params.vendorId;
  return exports.updateBankDetails(req, res);
};

/**
 * PUT /outlet (multipart/form-data)
 * Body:
 *  - vendorId
 *  - outlet_name, outlet_manager_name, outlet_contact_no, outlet_phone_no
 *  - outlet_location[street|city|district|state|country|postalCode]
 *  - outlet_coords[lat|lng]
 *  - outlet_nameboard_image (file)
 */
exports.updateOutlet = async (req, res) => {
  try {
    const b = req.body || {};
    const vendorId = (b.vendorId || "").trim();
    if (!vendorId) {
      return res.status(400).json({ ok: false, message: "vendorId required" });
    }

    const set = { updated_at: new Date() };

    if (b.outlet_name) set.outlet_name = String(b.outlet_name).trim();
    if (b.outlet_manager_name)
      set.outlet_manager_name = String(b.outlet_manager_name).trim();
    if (b.outlet_contact_no)
      set.outlet_contact_no = String(b.outlet_contact_no).trim();
    if (b.outlet_phone_no)
      set.outlet_phone_no = String(b.outlet_phone_no).trim();

    if (b.outlet_location && typeof b.outlet_location === "object") {
      const a = b.outlet_location;
      ["street", "city", "district", "state", "country", "postalCode"].forEach(
        (k) => {
          const v = a[k];
          if (v !== undefined && v !== null && String(v).trim() !== "") {
            set[`outlet_location.${k}`] = String(v).trim();
          }
        }
      );
    }

    if (b.outlet_coords && typeof b.outlet_coords === "object") {
      const { lat, lng } = b.outlet_coords;
      if (lat !== undefined && lat !== null)
        set["outlet_coords.lat"] = Number(lat);
      if (lng !== undefined && lng !== null)
        set["outlet_coords.lng"] = Number(lng);
    }

    if (req.file) {
      // store filename only (your existing UI builds /uploads/<filename> URLs)
      set.outlet_nameboard_image = req.file.filename;
    }

    const updated = await Vendor.findByIdAndUpdate(
      vendorId,
      { $set: set },
      { new: true }
    );
    if (!updated)
      return res.status(404).json({ ok: false, message: "Vendor not found" });

    return res.json({ ok: true, data: updated });
  } catch (e) {
    console.error("updateOutlet error:", e);
    return res
      .status(500)
      .json({ ok: false, message: "Outlet update failed", details: e.message });
  }
};

// Optional helper middleware if you validate geolocation elsewhere
exports.validateGeolocation = (req, res, next) => {
  const { lat, lng } = req.body.outlet_coords || {};
  if (lat === undefined || lng === undefined) {
    return res
      .status(400)
      .json({ ok: false, message: "Latitude and longitude are required." });
  }
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return res
      .status(400)
      .json({ ok: false, message: "Invalid latitude or longitude." });
  }
  next();
};

exports.registerVendor = async (req, res) => {
  try {
    const vendorData = req.body;
    const vendor = new Vendor(vendorData);
    await vendor.save();
    res
      .status(201)
      .json({ ok: true, message: "Vendor registered successfully", vendor });
  } catch (error) {
    res
      .status(500)
      .json({ ok: false, message: "Error registering vendor", error });
  }
};

module.exports = {
  uploadDocument: exports.uploadDocument,
  saveStepByKey: exports.saveStepByKey,
  saveStep: exports.saveStep,
  updateGst: exports.updateGst,
  updateBankDetails: exports.updateBankDetails,
  updateBankByParam: exports.updateBankByParam,
  updateOutlet: exports.updateOutlet,
  validateGeolocation: exports.validateGeolocation,
  registerVendor: exports.registerVendor,
};
