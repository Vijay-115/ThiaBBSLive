const Product = require('../models/Product');
const Variant = require("../models/Variant");
const User = require("../models/User");
const UserDetails = require("../models/UserDetails");
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;

    const R = 6371; // Earth radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
};

exports.createProduct = async (req, res) => {
    try {
        console.log("createProduct", req.body); // Log full request body

        const { _id, name, description, price, stock, SKU, brand, weight, dimensions, tags, category_id, subcategory_id, is_variant } = req.body;

        // Parse `variants` field if it exists and is a string
        let variantData = [];
        if (req.body.variants) {
            try {
                variantData = JSON.parse(req.body.variants); // Convert string to object
            } catch (error) {
                return res.status(400).json({ message: "Invalid variants format" });
            }
        }

        // Parse `dimensions` if it is sent as a string
        let parsedDimensions = {};
        if (dimensions) {
            try {
                parsedDimensions = JSON.parse(dimensions);
            } catch (error) {
                return res.status(400).json({ message: "Invalid dimensions format" });
            }
        }

        // Ensure `req.files` contains the uploaded files
        const productImage = req.files?.['product_img'] ? `/uploads/${req.files['product_img'][0].filename}` : '';
        const galleryImages = req.files?.['gallery_imgs'] ? req.files['gallery_imgs'].map(file => `/uploads/${file.filename}`) : [];

        // Get the current user's ID from the authenticated request
        const seller_id = req.user ? req.user.userId : null;
        if (!seller_id) {
            return res.status(401).json({ message: "Unauthorized: User ID not found" });
        }

        let newProduct;

        // Check if variants exist
        if (is_variant === 'true' && variantData.length > 0) {
            newProduct = new Product({
                name,
                description,
                SKU,
                brand,
                weight,
                dimensions: parsedDimensions,
                tags,
                category_id,
                subcategory_id,
                product_img: productImage,
                gallery_imgs: galleryImages,
                seller_id,
                is_variant: true,
            });

            await newProduct.save();

            // Create variants for the product
            const variants = variantData.map(variant => ({
                product_id: newProduct._id,
                variant_name: variant.variant_name,
                price: variant.price,
                stock: variant.stock,
                SKU: variant.SKU,
                attributes: variant.attributes,
                variant_img: variant.variant_img || '',
            }));

            await Variant.insertMany(variants);
        } else {
            // If no variants, create a normal product
            newProduct = new Product({
                name,
                description,
                price,
                stock,
                SKU,
                brand,
                weight,
                dimensions: parsedDimensions,
                tags,
                category_id,
                subcategory_id,
                product_img: productImage,
                gallery_imgs: galleryImages,
                seller_id,
            });

            await newProduct.save();
        }

        res.status(201).json(newProduct);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

// READ: Get all products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find(); // .populate('category_id subcategory_id seller_id')
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// READ: Get a single product by product_id
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category_id subcategory_id seller_id');
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getNearbySellerProducts = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).populate("userdetails");

        if (!user || !user.userdetails) {
            return res.status(404).json({ message: "User details not found" });
        }

        const { latitude, longitude } = user.userdetails;

        if (!latitude || !longitude) {
            return res.status(400).json({ message: "User location not available" });
        }

        // Set search radius (e.g., 5 km)
        const searchRadius = 5;

        // Fetch all sellers (users with role "seller")
        const sellers = await User.find({ role: "seller" }).populate("userdetails");

        // Filter sellers within the radius
        const nearbySellers = sellers.filter((seller) => {
            if (seller.userdetails?.latitude && seller.userdetails?.longitude) {
                const distance = haversineDistance(
                    latitude,
                    longitude,
                    seller.userdetails.latitude,
                    seller.userdetails.longitude
                );
                return distance <= searchRadius; // Only keep sellers within radius
            }
            return false;
        });

        // Extract seller IDs
        const sellerIds = nearbySellers.map((seller) => seller._id);

        // Fetch products from nearby sellers
        const products = await Product.find({ seller_id: { $in: sellerIds } });

        res.status(200).json({
            message: "Nearby seller products fetched successfully",
            products,
        });
    } catch (error) {
        console.error("Error fetching nearby seller products:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// UPDATE: Update a product by product_id with image upload
exports.updateProduct = async (req, res) => {
    try {
        console.log("🔄 Received Update Request:", req.body);
        
        const productId = req.params.id;
        const existingProduct = await Product.findOne({ _id: productId });

        if (!existingProduct) {
            return res.status(404).json({ message: "❌ Product not found" });
        }

        let updatedProductData = { ...req.body };

        // ✅ Handle product image update
        if (req.files && req.files["product_img"]) {
            updatedProductData.product_img = `/uploads/${req.files["product_img"][0].filename}`;
        } else {
            updatedProductData.product_img = existingProduct.product_img || "";
        }

        // ✅ Handle gallery images update
        if (req.files && req.files["gallery_imgs"]) {
            const newGalleryImages = req.files["gallery_imgs"].map(file => `/uploads/${file.filename}`);
            updatedProductData.gallery_imgs = [...existingProduct.gallery_imgs, ...newGalleryImages];
        } else {
            updatedProductData.gallery_imgs = existingProduct.gallery_imgs || [];
        }

        // ✅ Parse dimensions if needed
        if (req.body.dimensions) {
            try {
                updatedProductData.dimensions = JSON.parse(req.body.dimensions);
            } catch (error) {
                return res.status(400).json({ message: "❌ Invalid dimensions format" });
            }
        }

        // ✅ Update the product details
        const updatedProduct = await Product.findOneAndUpdate(
            { _id: productId },
            updatedProductData,
            { new: true }
        );
        console.log("✅ Product Updated:", updatedProduct);

        // ✅ Handle variants
        if (req.body.variants) {
            let variantData;
            try {
                variantData = JSON.parse(req.body.variants);
            } catch (error) {
                return res.status(400).json({ message: "❌ Invalid variants format" });
            }
            console.log("🔍 Parsed Variants Data:", variantData);

            // Fetch existing variants
            const existingVariants = await Variant.find({ product_id: updatedProduct._id });
            const existingVariantIds = existingVariants.map(v => v._id.toString());
            console.log("📌 Existing Variant IDs:", existingVariantIds);

            // ✅ Process each variant
            const bulkOperations = [];
            for (const variant of variantData) {
                if (!variant._id) {
                    variant._id = new mongoose.Types.ObjectId(); // Assign a new ObjectId to new variants
                }

                if (existingVariantIds.includes(variant._id.toString())) {
                    console.log("🔄 Updating Variant:", variant._id);
                    bulkOperations.push({
                        updateOne: {
                            filter: { _id: variant._id, product_id: updatedProduct._id },
                            update: {
                                variant_name: variant.variant_name,
                                price: variant.price,
                                stock: variant.stock,
                                SKU: variant.SKU,
                                attributes: variant.attributes,
                                variant_img: variant.variant_img || "",
                            },
                        },
                    });
                } else {
                    console.log("➕ Creating New Variant:", variant);
                    bulkOperations.push({
                        insertOne: { document: { ...variant, product_id: updatedProduct._id } },
                    });
                }
            }

            // ✅ Execute bulk write for variants
            if (bulkOperations.length > 0) {
                const bulkResult = await Variant.bulkWrite(bulkOperations);
                console.log("✅ BulkWrite Result:", bulkResult);
            }

            // ✅ Fetch all variants after update
            const allVariantsAfterUpdate = await Variant.find({ product_id: updatedProduct._id });
            const updatedVariantIds = allVariantsAfterUpdate.map(v => v._id.toString());

            console.log("✅ Final Variant IDs After Insert:", updatedVariantIds);

            // ✅ Delete variants that are no longer in the updated list
            const deleteResult = await Variant.deleteMany({
                product_id: updatedProduct._id,
                _id: { $nin: updatedVariantIds },
            });
            console.log("🗑️ Deleted Variants Result:", deleteResult);
        }

        res.status(200).json({ message: "✅ Product updated successfully", product: updatedProduct });

    } catch (err) {
        console.error("❌ Error:", err);
        res.status(500).json({ message: err.message });
    }
};


// DELETE: Delete a product by product_id
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findOne({ _id: req.params.id });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const { product_img, gallery_imgs } = product;
        const uploadDir = path.join(__dirname, '../uploads');

        const deleteImage = (filePath) => {
            if (filePath) {
                const fullPath = path.join(uploadDir, path.basename(filePath));
                if (fs.existsSync(fullPath)) {
                    fs.unlink(fullPath, (err) => {
                        if (err) {
                            console.error(`Error deleting file ${fullPath}:`, err);
                        }
                    });
                }
            }
        };

        deleteImage(product_img);
        if (Array.isArray(gallery_imgs) && gallery_imgs.length > 0) {
            gallery_imgs.forEach(deleteImage);
        }

        await Product.findOneAndDelete({ _id: req.params.id });
        res.status(200).json({ message: 'Product and associated images deleted successfully' });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: err.message });
    }
};