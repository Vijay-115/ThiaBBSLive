// middleware/requireAssignedVendor.js
const { getOrCreateAssignment } = require("../services/vendorAssignService");

module.exports = async function requireAssignedVendor(req, res, next) {
  try {
    const pincode =
      req.user?.default_pincode ||
      req.headers["x-pincode"] ||
      req.query.pincode ||
      req.body?.pincode;

    if (!pincode)
      return res.status(400).json({ message: "pincode is required" });

    const customerKey = req.user?.userId || req.headers["x-guest-key"];
    if (!customerKey)
      return res
        .status(401)
        .json({ message: "customer or guest key required" });

    const doc = await getOrCreateAssignment({
      customerKey: String(customerKey),
      pincode: String(pincode),
    });
    req.assignedVendorId = doc.vendorId;
    req.assignedPincode = doc.pincode;
    req.assignedDateKey = doc.dateKey;
    next();
  } catch (err) {
    console.error("requireAssignedVendor error:", err);
    res
      .status(500)
      .json({ message: err.message || "Assignment middleware error" });
  }
};
