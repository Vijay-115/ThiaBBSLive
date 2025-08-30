// models/CustomerVendorAssignment.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const CustomerVendorAssignmentSchema = new Schema({
  customerKey: { type: String, required: true, index: true }, // userId or guest key
  pincode: { type: String, required: true, index: true },
  dateKey: { type: String, required: true, index: true }, // "YYYY-MM-DD" (IST)
  vendorId: { type: Schema.Types.ObjectId, ref: "Vendor", required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, index: true }, // set to a few minutes after midnight IST
});

// unique per (customerKey, pincode, date)
CustomerVendorAssignmentSchema.index(
  { customerKey: 1, pincode: 1, dateKey: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  "CustomerVendorAssignment",
  CustomerVendorAssignmentSchema
);
