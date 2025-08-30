// controllers/adminVendorsController.js
const mongoose = require("mongoose");
const crypto = require("crypto");

const { sendMail,vendorSetPasswordEmail } = require("../utils/mailer");
const VendorCredentialIssue = require("../models/VendorCredentialIssue");
const bcrypt = require("bcryptjs");
const Vendor = require("../models/Vendor");
const User = require("../models/User"); // must exist in your project
// function randomPassword(len = 10) {
//   const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%";
//   return Array.from(
//     { length: len },
//     () => chars[Math.floor(Math.random() * chars.length)]
//   ).join("");
// }

const genToken = () => crypto.randomBytes(32).toString("hex");
const expiresIn48h = () => new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
function generateToken() {
  return crypto.randomBytes(32).toString("hex");
}


function randomPassword(len = 10) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%";
  return Array.from(
    { length: len },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join("");
}


// List vendors (approved, submitted, etc.)
exports.listVendors = async (req, res) => {
  try {
    const status = (req.query.status || "all").toLowerCase();
    const filter = {};
    if (status !== "all") filter.application_status = status;

    const vendors = await Vendor.find(filter)
      .select({
        legal_name: 1,
        display_name: 1,
        email: 1,
        phone: 1,
        application_status: 1,
        user_id: 1,
        createdAt: 1,
        updatedAt: 1,
      })
      .sort({ createdAt: -1 })
      .lean();

    return res.json({ success: true, vendors });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to list vendors" });
  }
};

// Approve vendor
exports.approveVendorRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const vendor = await Vendor.findById(id);
    if (!vendor)
      return res
        .status(404)
        .json({ success: false, message: "Vendor not found" });

    vendor.application_status = "approved";
    vendor.updatedAt = new Date();
    await vendor.save();

    return res.json({ success: true, vendor });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to approve vendor" });
  }
};


// Create credentials (set-password link)
exports.createVendorCredentials = async (req, res) => {
  try {
    const { id } = req.params;

    const vendor = await Vendor.findById(id);
    if (!vendor)
      return res
        .status(404)
        .json({ success: false, message: "Vendor not found" });
    if (vendor.application_status !== "approved")
      return res
        .status(400)
        .json({ success: false, message: "Vendor must be approved first" });

    // Create or fetch linked user
    let user;
    if (!vendor.user_id) {
      const placeholderHash = await User.hashPassword("placeholder");
      user = await User.create({
        name: vendor.display_name || vendor.legal_name,
        email: vendor.email,
        phone: vendor.phone,
        password: placeholderHash,
        role: "seller",
        mustChangePassword: true,
      });
      vendor.user_id = user._id;
      await vendor.save();
    } else {
      user = await User.findById(vendor.user_id);
      if (!user)
        return res
          .status(404)
          .json({ success: false, message: "Linked user not found" });
      user.mustChangePassword = true;
    }

    // Generate new token + expiry (invalidate any previous)
    const token = genToken();
    user.passwordResetToken = token;
    user.passwordResetExpires = expiresIn48h();
    await user.save();

    const link = `${process.env.VENDOR_PORTAL_URL}/vendor/set-password/${token}`;

    // Send email
    const { subject, text, html } = vendorSetPasswordEmail({
      name: user.name || "Vendor",
      email: user.email,
      link,
    });
    await sendMail({ to: user.email, subject, text, html });

    // Log
    await VendorCredentialIssue.create({
      vendor_id: vendor._id,
      email: user.email,
      status: "sent",
      smtp_provider: "zoho",
      issued_to_user_id: user._id,
      response_raw: { link },
    });

    return res.json({
      success: true,
      message: "Set-password link sent",
      vendorId: vendor._id,
    });
  } catch (err) {
    return res
      .status(500)
      .json({
        success: false,
        message: err.message || "Failed to create credentials",
      });
  }
};

 
exports.seedPincodeVendors = async (req, res) => {
  try {
    const PincodeVendors = require("../models/PincodeVendors");
    const vendors = await Vendor.find({
      is_active: true,
      is_decline: { $ne: true },
      user_id: { $ne: null },
    })
      .select(
        "user_id register_business_address.outlet_location outlet_location register_business_address"
      )
      .lean();

    const byPin = new Map();
    for (const v of vendors) {
      const pin =
        v?.register_business_address?.postalCode ||
        v?.outlet_location?.postalCode;
      if (!pin) continue;
      if (!byPin.has(pin)) byPin.set(pin, []);
      byPin.get(pin).push(String(v.user_id));
    }

    const results = [];
    for (const [pincode, vendorIds] of byPin.entries()) {
      const unique = Array.from(new Set(vendorIds));
      await PincodeVendors.findOneAndUpdate(
        { pincode },
        {
          pincode,
          vendorIds: unique,
          active: true,
          pausedVendorIds: [],
          dailyStartOffset: 0,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      results.push({ pincode, count: unique.length });
    }

    res.json({ success: true, pins: results });
  } catch (err) {
    console.error("seedPincodeVendors error", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.resendVendorCredentials = async (req, res) => {
  try {
    const vendorId = req.params.vendorId;
    if (!vendorId || !mongoose.Types.ObjectId.isValid(vendorId)) {
      return res
        .status(400)
        .json({ success: false, message: "Valid vendorId is required" });
    }

    const vendor = await Vendor.findById(vendorId).lean();
    if (!vendor?.user_id)
      return res
        .status(400)
        .json({ success: false, message: "Vendor has no user yet" });

    const user = await User.findById(vendor.user_id).lean();
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const plain = randomPassword(10);
    const passwordHash = await bcrypt.hash(plain, 10);

    await User.updateOne(
      { _id: user._id },
      { $set: { password: passwordHash, must_change_password: true } }
    );

    const reIssue = await VendorCredentialIssue.create({
      userId: user._id,
      vendorId: vendor._id,
      email: user.email,
      tempPasswordHash: passwordHash,
      mustChangePassword: true,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      createdBy: req.user?._id || null,
      deliveryStatus: "pending",
    });

    const { subject, text, html } = vendorWelcomeEmail({
      name: user.name,
      email: user.email,
      tempPassword: plain,
    });

    try {
      await sendMail({ to: user.email, subject, text, html });
      await VendorCredentialIssue.updateOne(
        { _id: reIssue._id },
        { $set: { deliveredAt: new Date(), deliveryStatus: "sent" } }
      );
      return res.json({
        success: true,
        message: "Password reset & emailed",
        emailDelivery: "sent",
      });
    } catch (mailErr) {
      await VendorCredentialIssue.updateOne(
        { _id: reIssue._id },
        {
          $set: {
            deliveryStatus: "failed",
            deliveryError: String(mailErr?.message || mailErr),
          },
        }
      );
      return res.json({
        success: true,
        message: "Password reset; email failed",
        emailDelivery: "failed",
      });
    }
  } catch (err) {
    console.error("resendVendorCredentials error", err);
    return res
      .status(500)
      .json({ success: false, message: err.message || "Server error" });
  }
};
exports.getVendorById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid id" });
    }
    const v = await Vendor.findById(id)
      .select({
        legal_name: 1,
        display_name: 1,
        email: 1,
        phone: 1,
        application_status: 1,
        user_id: 1,
        createdAt: 1,
        updatedAt: 1,
      })
      .lean();

    if (!v)
      return res.status(404).json({ success: false, message: "Not found" });
    return res.json({ success: true, ok: true, data: v });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch vendor" });
  }
};