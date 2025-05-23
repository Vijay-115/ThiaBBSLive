const Vendor = require("../models/Vendor");
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // Assuming User model exists

exports.registerVendor = async (req, res) => {
    try {
        console.log("✅ Received Request Body:", req.body);
        console.log("✅ Received Files:", req.files);
        // return false;
        // Convert JSON strings to objects (if coming from form-data)
        const parseJson = (data) => {
            try {
                return JSON.parse(data);
            } catch (error) {
                return data; // Return original data if parsing fails
            }
        };

        const {
            vendor_fname,
            vendor_lname,
            dob,
            business_type,
            brand_name,
            contact_person,
            email,
            mobile,
            alt_mobile,
            education_qualify,
            work_experience,
            referral_details,
            lang_proficiency,
            aadhar_number,
            pan_number,
            gst_number,
            fssai_license,
            shop_establish_license,
            outlet_manager_name,
            outlet_contact_no,
            bank_name,
            account_holder_name,
            account_no,
            ifcs_code,
            branch_name,
            vendor_bio,
            product_category,
            product_category_other,
            termsConditions,
            privacyPolicy,
            sellerPolicy,
            role,
        } = req.body;

        // Convert address fields from string to object
        const register_business_address = parseJson(req.body.register_business_address);
        const operational_address = parseJson(req.body.operational_address);
        const outlet_location = parseJson(req.body.outlet_location);

        // Extract uploaded file paths
        const pan_pic =  req.files.find(file => file.fieldname === "pan_pic") ? `/uploads/${req.files.find(file => file.fieldname === "pan_pic").filename}` : null;
        const aadhar_pic =  req.files.find(file => file.fieldname === "aadhar_pic") ? `/uploads/${req.files.find(file => file.fieldname === "aadhar_pic").filename}` : null;
        const self_declaration =  req.files.find(file => file.fieldname === "self_declaration") ? `/uploads/${req.files.find(file => file.fieldname === "self_declaration").filename}` : null;
        const criminal_history =  req.files.find(file => file.fieldname === "criminal_history") ? `/uploads/${req.files.find(file => file.fieldname === "criminal_history").filename}` : null;
        const gst_pic = req.files.find(file => file.fieldname === "gst_pic") ? `/uploads/${req.files.find(file => file.fieldname === "gst_pic").filename}` : null;
        const fssai_pic = req.files.find(file => file.fieldname === "fssai_pic") ? `/uploads/${req.files.find(file => file.fieldname === "fssai_pic").filename}` : null;
        const shop_establish_pic = req.files.find(file => file.fieldname === "shop_establish_pic") ? `/uploads/${req.files.find(file => file.fieldname === "shop_establish_pic").filename}` : null;
        const cancel_cheque_passbook = req.files.find(file => file.fieldname === "cancel_cheque_passbook") ? `/uploads/${req.files.find(file => file.fieldname === "cancel_cheque_passbook").filename}` : null;
        const passbook = req.files.find(file => file.fieldname === "passbook") ? `/uploads/${req.files.find(file => file.fieldname === "passbook").filename}` : null;
        const profile_pic = req.files.find(file => file.fieldname === "profile_pic") ? `/uploads/${req.files.find(file => file.fieldname === "profile_pic").filename}` : null;
        const cover_pic = req.files.find(file => file.fieldname === "cover_pic") ? `/uploads/${req.files.find(file => file.fieldname === "cover_pic").filename}` : null;
        const address_proof = req.files.find(file => file.fieldname === "address_proof") ? `/uploads/${req.files.find(file => file.fieldname === "address_proof").filename}` : null;
        
        

        // Ensure required fields are present
        if (!vendor_fname || !business_type || !contact_person || !email || !mobile || !pan_number || !outlet_manager_name || !outlet_contact_no || !bank_name || !account_holder_name || !account_no || !ifcs_code || !branch_name) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const existingUser = await User.findOne({ email });
        
        if (existingUser) {
            return res.status(400).json({ 
                success: false, 
                message: "User with this email or mobile already exists" 
            });
        }

        const existingVendor = await Vendor.findOne({ 
            $or: [{ email }, { mobile }] // Check if email OR mobile already exists
        });
        
        if (existingVendor) {
            return res.status(400).json({ 
                success: false, 
                message: "Vendor with this email or mobile already exists" ,
                vendor: existingVendor
            });
        }
        

        // Create new vendor
        const newVendor = new Vendor({
            vendor_fname,
            vendor_lname,
            dob,
            business_type,
            brand_name,
            contact_person,
            email,
            mobile,
            alt_mobile,
            education_qualify,
            work_experience,
            referral_details,
            lang_proficiency,
            register_business_address,
            operational_address,
            aadhar_number,
            aadhar_pic,
            self_declaration,
            criminal_history,
            pan_number,
            pan_pic,
            gst_number,
            gst_pic,
            fssai_license,
            fssai_pic,
            shop_establish_license,
            shop_establish_pic,
            outlet_location,
            outlet_manager_name,
            outlet_contact_no,
            bank_name,
            account_holder_name,
            account_no,
            ifcs_code,
            branch_name,
            cancel_cheque_passbook,
            passbook,
            profile_pic,
            cover_pic,
            vendor_bio,
            product_category,
            product_category_other,
            address_proof,
            termsConditions,
            privacyPolicy,
            sellerPolicy,
            role,
        });

        // Save vendor to the database
        await newVendor.save();

        return res.status(201).json({ success: true, message: "Vendor registered successfully", vendor: newVendor });

    } catch (error) {
        console.error("❌ Error registering vendor:", error);
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

exports.getRequest = async (req, res) => {
    try {
        const vendors = await Vendor.find({is_active:false}); //
        console.log('getRequest', vendors);
        res.status(200).json(vendors);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.approveVendor = async (req, res) => {
    try {
        console.log('approveVendor', req.params);
        const vendorId = req.params.id;

        // Validate ObjectId
        if (!vendorId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ error: "Invalid vendor ID format" });
        }

        // Find the vendor
        const vendor = await Vendor.findById(vendorId);
        if (!vendor) {
            return res.status(404).json({ error: "Vendor not found" });
        }

        // Approve the vendor
        vendor.is_active = true;

        // Generate a random password
        const randomPassword = crypto.randomBytes(6).toString('hex'); // Example: "a3f9b2e1"
        const hashedPassword = await bcrypt.hash(randomPassword, 10);

        // Create a new user for the vendor
        const newUser = new User({
            name: vendor.vendor_fname,
            email: vendor.email,
            password: hashedPassword, // Store hashed password
            role: vendor.role,
        });

        await newUser.save();

        console.log('newUser',newUser);
        
        vendor.user_id = newUser._id;
        await vendor.save();

        // Send email with login credentials
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: vendor.email,
            subject: 'Vendor Approval - Account Created',
            text: `Dear ${vendor.vendor_fname},\n\nYour vendor account has been approved.\n\nLogin Details:\nEmail: ${vendor.email}\nPassword: ${randomPassword}\n\nPlease log in and change your password immediately.\n\nRegards,\nBBSCart`
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({
            message: "Vendor approved successfully. Login credentials sent via email.",
            vendor
        });

    } catch (error) {
        console.error("Error approving vendor:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
