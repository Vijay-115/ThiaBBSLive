// controllers/customerBecomeVendorController.js
const path = require("path");
const mongoose = require("mongoose");

// Reuse your Agent schema/collection to avoid creating a new model file.
// If you prefer a separate collection, create models/CustomerBecomeVendor.js and import it here.
const CustomerBecomeVendor = require("../models/CustomerVendor");

// POST /upload -> { ok, fileUrl }  (no OCR)
exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ ok: false, message: "No file uploaded" });
    const fileUrl = `/uploads/${req.file.filename}`;
    return res.json({ ok: true, fileUrl });
  } catch (e) {
    console.error("customerBecomeVendor.uploadDocument error:", e);
    return res
      .status(500)
      .json({ ok: false, message: "Upload failed", details: e.message });
  }
};

// POST/PATCH /step-by-key  (partial upsert; bypass required validators on partial steps)
exports.saveStepByKey = async (req, res) => {
  try {
    const b = req.body || {};
    const id =
      b.customerBecomeVendorId &&
      mongoose.Types.ObjectId.isValid(b.customerBecomeVendorId)
        ? b.customerBecomeVendorId
        : b.agentHeadId && mongoose.Types.ObjectId.isValid(b.agentHeadId)
          ? b.agentHeadId
          : b.territoryHeadId &&
              mongoose.Types.ObjectId.isValid(b.territoryHeadId)
            ? b.territoryHeadId
            : b.franchiseeId && mongoose.Types.ObjectId.isValid(b.franchiseeId)
              ? b.franchiseeId
              : b.vendorId && mongoose.Types.ObjectId.isValid(b.vendorId)
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

    const doc = await CustomerBecomeVendor.findOneAndUpdate(
      { _id: id },
      {
        $set: set,
        $setOnInsert: {
          role: "customer_become_vendor",
          created_at: new Date(),
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
        runValidators: false,
      }
    );

    return res.json({ ok: true, data: doc, customerBecomeVendorId: doc._id });
  } catch (e) {
    console.error("customerBecomeVendor.saveStepByKey error:", e);
    return res
      .status(500)
      .json({ ok: false, message: "Save failed", details: e.message });
  }
};

// Optional legacy: PATCH /:customerBecomeVendorId/step
exports.saveStep = async (req, res) => {
  try {
    const { customerBecomeVendorId } = req.params;
    if (!customerBecomeVendorId)
      return res.status(400).json({ ok: false, message: "ID required" });
    const set = { ...(req.body || {}), updated_at: new Date() };
    const doc = await CustomerBecomeVendor.findByIdAndUpdate(
      customerBecomeVendorId,
      { $set: set },
      { new: true, runValidators: false }
    );
    if (!doc) return res.status(404).json({ ok: false, message: "Not found" });
    res.json({ ok: true, data: doc });
  } catch (e) {
    console.error("customerBecomeVendor.saveStep error:", e);
    res
      .status(500)
      .json({ ok: false, message: "Save failed", details: e.message });
  }
};

// PUT /gst  (multipart/form-data)
exports.updateGst = async (req, res) => {
  try {
    const b = req.body || {};
    const id = (
      b.customerBecomeVendorId ||
      b.agentHeadId ||
      b.territoryHeadId ||
      b.franchiseeId ||
      b.vendorId ||
      ""
    ).trim();
    if (!id)
      return res
        .status(400)
        .json({ ok: false, message: "customerBecomeVendorId required" });

    const set = { updated_at: new Date() };
    if (req.file) set.gst_cert_pic = `/uploads/${req.file.filename}`;
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

    const updated = await CustomerBecomeVendor.findByIdAndUpdate(
      id,
      { $set: set },
      { new: true, runValidators: false }
    );
    if (!updated)
      return res.status(404).json({ ok: false, message: "Not found" });
    return res.json({ ok: true, data: updated });
  } catch (e) {
    console.error("customerBecomeVendor.updateGst error:", e);
    return res
      .status(500)
      .json({ ok: false, message: "GST update failed", details: e.message });
  }
};

// PUT /bank   and   PUT /:customerBecomeVendorId/bank  (multipart/form-data)
exports.updateBankDetails = async (req, res) => {
  try {
    const id =
      req.params.customerBecomeVendorId ||
      req.body.customerBecomeVendorId ||
      req.body.agentHeadId ||
      req.body.territoryHeadId ||
      req.body.franchiseeId ||
      req.body.vendorId;
    if (!id)
      return res.status(400).json({ ok: false, message: "ID is required" });

    const set = { updated_at: new Date() };
    if (req.file) set.cancel_cheque_passbook = `/uploads/${req.file.filename}`;

    const b = req.body || {};
    if (b.account_holder_name)
      set.account_holder_name = String(b.account_holder_name).trim();
    if (b.account_no) set.account_no = String(b.account_no).trim();
    if (b.ifcs_code) set.ifcs_code = String(b.ifcs_code).trim().toUpperCase();
    if (b.bank_name) set.bank_name = String(b.bank_name).trim();
    if (b.branch_name) set.branch_name = String(b.branch_name).trim();
    if (b.bank_address) set.bank_address = String(b.bank_address).trim();

    const updated = await CustomerBecomeVendor.findByIdAndUpdate(
      id,
      { $set: set },
      { new: true, runValidators: false }
    );
    if (!updated)
      return res.status(404).json({ ok: false, message: "Not found" });
    return res.json({ ok: true, data: updated });
  } catch (e) {
    console.error("customerBecomeVendor.updateBank error:", e);
    return res
      .status(500)
      .json({ ok: false, message: "Bank update failed", details: e.message });
  }
};

exports.updateBankByParam = async (req, res) => {
  req.body = req.body || {};
  req.body.customerBecomeVendorId = req.params.customerBecomeVendorId;
  return exports.updateBankDetails(req, res);
};

// PUT /outlet (multipart/form-data)
exports.updateOutlet = async (req, res) => {
  try {
    const b = req.body || {};
    const id = (
      b.customerBecomeVendorId ||
      b.agentHeadId ||
      b.territoryHeadId ||
      b.franchiseeId ||
      b.vendorId ||
      ""
    ).trim();
    if (!id)
      return res
        .status(400)
        .json({ ok: false, message: "customerBecomeVendorId required" });

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

    if (req.file) set.outlet_nameboard_image = req.file.filename;

    const updated = await CustomerBecomeVendor.findByIdAndUpdate(
      id,
      { $set: set },
      { new: true, runValidators: false }
    );
    if (!updated)
      return res.status(404).json({ ok: false, message: "Not found" });
    return res.json({ ok: true, data: updated });
  } catch (e) {
    console.error("customerBecomeVendor.updateOutlet error:", e);
    return res
      .status(500)
      .json({ ok: false, message: "Outlet update failed", details: e.message });
  }
};

// Optional helper
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

// POST /register – finalize
exports.registerCustomerBecomeVendor = async (req, res) => {
  try {
    const id =
      req.body.customerBecomeVendorId ||
      req.body.agentHeadId ||
      req.body.territoryHeadId ||
      req.body.franchiseeId ||
      req.body.vendorId;
    if (!id)
      return res
        .status(400)
        .json({ ok: false, message: "customerBecomeVendorId required" });
    const updated = await CustomerBecomeVendor.findByIdAndUpdate(
      id,
      {
        $set: { status: "submitted", updated_at: new Date() },
        $setOnInsert: { role: "customer_become_vendor" },
      },
      { new: true, upsert: true, runValidators: false }
    );
    res
      .status(201)
      .json({
        ok: true,
        message: "Customer Become Vendor registered",
        customer: updated,
      });
  } catch (error) {
    console.error("customerBecomeVendor.register error:", error);
    res
      .status(500)
      .json({ ok: false, message: "Error registering", error: error.message });
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
  registerCustomerBecomeVendor: exports.registerCustomerBecomeVendor,
};
