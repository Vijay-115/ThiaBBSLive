const CustomerVendorAssignment = require("../models/CustomerVendorAssignment");
const Vendor = require("../models/Vendor");
const PincodeDayCounter = require("../models/PincodeDayCounter");

// Build YYYY-MM-DD in IST, regardless of server timezone
function todayKeyIST() {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return fmt.format(new Date()); // e.g. 2025-09-01
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

async function listApprovedVendorsForPincode(pincode) {
  return Vendor.find({
    application_status: "approved",
    "register_business_address.postalCode": String(pincode),
  })
    .select({ _id: 1, user_id: 1, display_name: 1, created_at: 1 })
    .sort({ created_at: 1, _id: 1 }) // stable order
    .lean();
}

// Atomic round-robin pick for the day
async function pickVendorRoundRobin(pincode, dateKey) {
  const vendors = await listApprovedVendorsForPincode(pincode);
  if (!vendors.length) return null;
  if (vendors.length === 1) return vendors[0];

  // Atomic counter per (pincode, dateKey)
  const ctr = await PincodeDayCounter.findOneAndUpdate(
    { pincode: String(pincode), dateKey },
    { $inc: { nextIndex: 1 } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  ).lean();

  const idx = Math.abs(ctr.nextIndex - 1) % vendors.length; // subtract 1 because we incremented
  return vendors[idx];
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

    const dateKey = todayKeyIST();
    const customerKey = getOrSetCustomerKey(req, res);

    // Reuse today’s assignment if it exists
    let assignment = await CustomerVendorAssignment.findOne({
      customerKey,
      pincode,
      dateKey,
    }).lean();

    if (!assignment) {
      const vendor = await pickVendorRoundRobin(pincode, dateKey);
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
            // expire a little after midnight IST
            expiresAt: new Date(Date.now() + 25 * 60 * 60 * 1000),
          },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true, lean: true }
      );
    }

    // Expose IDs for downstream controllers
    req.assignedVendorId = String(assignment.vendor_id);

    const v = await Vendor.findById(assignment.vendor_id)
      .select({ user_id: 1 })
      .lean();
    req.assignedVendorUserId = v?.user_id ? String(v.user_id) : null;
    req.assignedSellerUserId = req.assignedVendorUserId;

    return next();
  } catch (err) {
    console.error("assignVendorMiddleware error", err);
    return next(); // fail-open
  }
};
