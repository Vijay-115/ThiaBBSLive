const CustomerVendorAssignment = require("../models/CustomerVendorAssignment");
const Vendor = require("../models/Vendor");

function todayKey() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function getOrSetCustomerKey(req, res) {
  if (req.user?._id) return String(req.user._id);
  if (req.cookies?.cid) return req.cookies.cid;
  const cid = Math.random().toString(36).slice(2) + Date.now().toString(36);
  res.cookie("cid", cid, {
    httpOnly: false,
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000,
    path: "/",
  });
  return cid;
}

async function pickVendorForPincode(pincode) {
  // simple pick; replace with round-robin later if you add more vendors
  return await Vendor.findOne({
    application_status: "approved",
    "register_business_address.postalCode": String(pincode),
  })
    .select({ _id: 1, user_id: 1, display_name: 1 })
    .sort({ created_at: 1 })
    .lean();
}

module.exports = async function assignVendorMiddleware(req, res, next) {
  try {
    const pincode = (
      req.assignedPincode ||
      req.cookies?.pincode ||
      req.query?.pincode ||
      ""
    ).trim();
    if (!pincode) return next();

    const dateKey = todayKey();
    const customerKey = getOrSetCustomerKey(req, res);

    // existing assignment for today?
    let assignment = await CustomerVendorAssignment.findOne({
      customerKey,
      pincode,
      dateKey,
    }).lean();

    if (!assignment) {
      const vendor = await pickVendorForPincode(pincode);
      if (!vendor) {
        req.assignedVendorId = null;
        req.assignedVendorUserId = null;
        return next();
      }

      assignment = await CustomerVendorAssignment.findOneAndUpdate(
        { customerKey, pincode, dateKey },
        {
          $setOnInsert: {
            customerKey,
            pincode,
            dateKey,
            vendor_id: vendor._id,
            expiresAt: new Date(Date.now() + 25 * 60 * 60 * 1000),
          },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true, lean: true }
      );
    }

    // ✅ set the correct ids for downstream filters
    req.assignedVendorId = String(assignment.vendor_id); // the Vendor _id
    const v = await Vendor.findById(assignment.vendor_id)
      .select({ user_id: 1 })
      .lean();
    const vendorUserId = v?.user_id ? String(v.user_id) : null;

    req.assignedVendorUserId = vendorUserId; // 👈 what productController uses
    req.assignedSellerUserId = vendorUserId; // kept for compatibility

    return next();
  } catch (err) {
    console.error("assignVendorMiddleware error", err);
    return next();
  }
};
