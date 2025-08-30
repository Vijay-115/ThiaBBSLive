// controllers/geoController.js
const { getOrCreateAssignment } = require("../services/vendorAssignService");

exports.assignVendor = async (req, res) => {
  try {
    const { pincode } = req.body || {};
    if (!pincode)
      return res.status(400).json({ message: "pincode is required" });

    const customerKey =
      req.user?.userId || req.headers["x-guest-key"] || req.body.customerId;
    if (!customerKey)
      return res.status(400).json({ message: "customerKey is required" });

    const doc = await getOrCreateAssignment({
      customerKey: String(customerKey),
      pincode: String(pincode),
    });
    res.json({
      vendorId: doc.vendorId,
      pincode: doc.pincode,
      dateKey: doc.dateKey,
      expiresAt: doc.expiresAt,
    });
  } catch (err) {
    console.error("assignVendor error:", err);
    res.status(500).json({ message: err.message || "Assignment error" });
  }
};
