const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const AddressSchema = new mongoose.Schema({
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    postalCode: { type: String, required: true },
});

const VendorSchema = new mongoose.Schema({
    vendor_name: { type: String, required: true },
    business_type: { type: String, enum: ['Individual', 'Proprietorship', 'Partnership Firm', 'Private Limited Company', 'Public Company'], required: true },
    brand_name: { type: String, default: null },
    contact_person: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
    alt_mobile: { type: String, default: null },
    register_business_address: AddressSchema,
    operational_address: AddressSchema,
    pan_number: { type: String, required: true },
    pan_pic: { type: String, required: null },
    gst_number: { type: String, default: null },
    gst_pic: { type: String, default: null },
    fssai_license: { type: String, default: null },
    fssai_pic: { type: String, default: null },
    shop_establish_license: { type: String, default: null },
    shop_establish_pic: { type: String, default: null },
    outlet_location: AddressSchema,
    outlet_manager_name: { type: String, required: true },
    outlet_contact_no: { type: String, required: true },
    bank_name: { type: String, required: true },
    account_holder_name: { type: String, required: true },
    account_no: { type: String, required: true },
    ifcs_code: { type: String, required: true },
    branch_name: { type: String, required: true },
    cancel_cheque_passbook: { type: String, default: null },
    profile_pic: { type: String, default: null },
    cover_pic: { type: String, default: null },
    vendor_bio: { type: String, default: null },
    product_category: { type: String, enum: ['Jewelry', 'Electronics', 'Garments', 'Supermarket/FMCG', 'Health & Beauty', 'Home & Kitchen', 'Books & Stationery', 'Other'], required: true },
    product_category_other: { type: String, default: null },
    address_proof : { type: String, required: true },
    termsConditions: { type: Boolean, required: true },
    privacyPolicy: { type: Boolean, required: true },
    sellerPolicy: { type: Boolean, required: true },
    user_id: { type: ObjectId, ref: 'User', default: null },
    is_active: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

// Middleware to update `updated_at` before saving
VendorSchema.pre('save', function (next) {
    this.updated_at = Date.now();
    next();
});

const Vendor = mongoose.model('Vendor', VendorSchema);
module.exports = Vendor;
