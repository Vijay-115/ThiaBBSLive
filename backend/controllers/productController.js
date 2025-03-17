const Product = require('../models/Product');
const Variant = require("../models/Variant");
const User = require("../models/User");
const UserDetails = require("../models/UserDetails");
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");

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
        console.log("createProduct", req.body);
        console.log("createProductFiles", req.files);

        const { _id, name, description, price, stock, SKU, brand, weight, dimensions, tags, category_id, subcategory_id, is_variant } = req.body;

        let variantData = [];
        if (req.body.variants) {
            try {
                variantData = JSON.parse(req.body.variants);
            } catch (error) {
                return res.status(400).json({ message: "Invalid variants format" });
            }
        }

        let parsedDimensions = {};
        if (dimensions) {
            try {
                parsedDimensions = JSON.parse(dimensions);
            } catch (error) {
                return res.status(400).json({ message: "Invalid dimensions format" });
            }
        }

        let parsedTags = [];
        if (typeof tags === "string") {
            try {
                parsedTags = JSON.parse(tags);
            } catch (error) {
                console.error("❌ Error parsing tags:", error);
                parsedTags = [];
            }
        } else if (!Array.isArray(tags)) {
            parsedTags = [];
        }

        const productImage = req.files.find(file => file.fieldname === "product_img") 
            ? `/uploads/${req.files.find(file => file.fieldname === "product_img").filename}` 
            : "";

        const galleryImages = req.files
            .filter(file => file.fieldname === "gallery_imgs")
            .map(file => `/uploads/${file.filename}`);

        const seller_id = req.user ? req.user.userId : null;
        if (!seller_id) {
            return res.status(401).json({ message: "Unauthorized: User ID not found" });
        }

        let newProduct;
        let variantIds = [];

        if (is_variant === 'true' && variantData.length > 0) {
            newProduct = new Product({
                name,
                description,
                SKU,
                brand,
                weight,
                dimensions: parsedDimensions,
                tags: parsedTags,
                category_id,
                subcategory_id,
                product_img: productImage,
                gallery_imgs: galleryImages,
                seller_id,
                is_variant: true,
            });

            await newProduct.save();

            const variants = await Variant.insertMany(
                variantData.map((variant, index) => {
                    const variantImg = req.files.find(file => file.fieldname === `variant_img_${index}`)
                        ? `/uploads/${req.files.find(file => file.fieldname === `variant_img_${index}`).filename}`
                        : "";

                    const variantGalleryImgs = req.files
                        .filter(file => file.fieldname === `variant_gallery_imgs_${index}`)
                        .map(file => `/uploads/${file.filename}`);

                    console.log(`Variant ${index} Image Path:`, variantImg);
                    console.log(`Variant ${index} Gallery Paths:`, variantGalleryImgs);

                    return {
                        product_id: newProduct._id,
                        variant_name: variant.variant_name,
                        price: variant.price,
                        stock: variant.stock,
                        SKU: variant.SKU,
                        attributes: variant.attributes,
                        variant_img: variantImg,
                        variant_gallery_imgs: variantGalleryImgs,
                    };
                })
            );

            variantIds = variants.map(variant => variant._id);
            newProduct.variants = variantIds;
            await newProduct.save();
        } else {
            newProduct = new Product({
                name,
                description,
                price,
                stock,
                SKU,
                brand,
                weight,
                dimensions: parsedDimensions,
                tags: parsedTags,
                category_id,
                subcategory_id,
                product_img: productImage,
                gallery_imgs: galleryImages,
                seller_id,
                is_variant: false,
                variants: [],
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
        const products = await Product.find().populate('category_id subcategory_id variants seller_id'); //
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getAllProductTags = async (req, res) => {
    try {
        const products = await Product.find({}, 'tags'); // Get only the tags field

        // Flatten and filter unique tags
        const uniqueTags = [...new Set(products.flatMap(product => product.tags))];

        res.status(200).json({ tags: uniqueTags });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// READ: Get a single product by product_id
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category_id subcategory_id variants seller_id');
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// READ: Get a single product by seller_id
exports.getProductsBySellerId = async (req, res) => {
    console.log('getProductsBySellerId');
    try {
        const { sellerId } = req.params; 
        const products = await Product.find({ seller_id: sellerId }).populate('category_id subcategory_id variants seller_id');
        if (!products) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// READ: Get products by category_id
exports.getProductsByCategoryId = async (req, res) => {
    try {
        const { categoryId } = req.params; // Get category ID from request params

        const products = await Product.find({ category_id: categoryId }).populate('category_id subcategory_id variants seller_id');

        if (!products || products.length === 0) {
            return res.status(404).json({ message: 'No products found for this category' });
        }

        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// READ: Get products by category_id
exports.getProductsBySubCategoryId = async (req, res) => {
    try {
        const { subcategoryId } = req.params; // Get category ID from request params

        const products = await Product.find({ subcategory_id: subcategoryId }).populate('category_id subcategory_id variants seller_id');

        if (!products || products.length === 0) {
            return res.status(404).json({ message: 'No products found for this subcategory' });
        }

        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// READ: Get products by filters
exports.getProductByFilter = async (req, res) => {
    try {
        const { categories, subcategories, colors, tags, minPrice, maxPrice } = req.query;

        let filterConditions = {};

        // Filter by categories
        if (categories) {
            const categoryArray = categories.split(",").map(id => id.trim());
            filterConditions.category_id = { $in: categoryArray };
        }

        // Filter by subcategories
        if (subcategories) {
            const subcategoryArray = subcategories.split(",").map(id => id.trim());
            filterConditions.subcategory_id = { $in: subcategoryArray };
        }

        // Filter by colors
        if (colors) {
            const colorArray = colors.split(",").map(color => color.trim());
            filterConditions.color = { $in: colorArray };
        }

        // Filter by tags
        if (tags) {
            const tagArray = tags.split(",").map(tag => tag.trim());
            filterConditions.tags = { $in: tagArray };
        }

        // Filter by price range
        if (minPrice || maxPrice) {
            filterConditions.price = {};
            if (minPrice) filterConditions.price.$gte = parseFloat(minPrice);
            if (maxPrice) filterConditions.price.$lte = parseFloat(maxPrice);
        }

        console.log('Filter Conditions:', filterConditions);

        // Fetch filtered products
        const products = await Product.find(filterConditions)
            .populate("category_id subcategory_id variants seller_id");

        if (!products.length) {
            return res.status(404).json({ message: "No products found matching the filters." });
        }

        res.status(200).json(products);
    } catch (err) {
        console.error("Error fetching products:", err);
        res.status(500).json({ message: err.message });
    }
};


exports.getNearbySellerProducts = async (req, res) => {
    try {        
        console.log("🟡 getNearbySellerProducts req.user:", req.user);

        if (!req.user || !req.user.userId) {
            return res.status(401).json({ message: "Unauthorized: User not authenticated" });
        }

        const user_id = req.user.userId;
        const user = await User.findById(user_id).populate("userdetails");

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

        res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching nearby seller products:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


// UPDATE: Update a product by product_id with image upload
exports.updateProduct = async (req, res) => {
    try {
        console.log('typeof',typeof req.body.variants);
        
        console.log("updateProduct", req.files);
        console.log("🔄 Received Update Request:", req.body);

        const productId = req.params.id;
        const existingProduct = await Product.findById(productId);
        if (!existingProduct) {
            return res.status(404).json({ message: "❌ Product not found" });
        }

        // Ensure variants are parsed properly before updating
        if (typeof req.body.variants === 'string') {
            try {
            req.body.variants = JSON.parse(req.body.variants);
            } catch (error) {
            return res.status(400).json({ error: 'Invalid variants format' });
            }
        }

        let updatedProductData = { ...req.body };

         // Parse dimensions if needed
         if (req.body.dimensions) {
            try {
                updatedProductData.dimensions = JSON.parse(req.body.dimensions);
            } catch (error) {
                return res.status(400).json({ message: "Invalid dimensions format" });
            }
        }

        // ✅ Handle Product Image Update
        const productImgFile = req.files.find(file => file.fieldname === "product_img");
        if (productImgFile) {
            if (existingProduct.product_img) removeOldImage(existingProduct.product_img); // Remove old image
            updatedProductData.product_img = `/uploads/${productImgFile.filename}`;
        } else {
            updatedProductData.product_img = existingProduct.product_img || "";
        }

        // ✅ Handle Gallery Images Update
        const galleryImages = req.files.filter(file => file.fieldname === "gallery_imgs");
        if (galleryImages.length > 0) {
            if (existingProduct.gallery_imgs?.length > 0) {
                existingProduct.gallery_imgs.forEach(removeOldImage); // Remove old images
            }
            updatedProductData.gallery_imgs = galleryImages.map(file => `/uploads/${file.filename}`);
        } else {
            updatedProductData.gallery_imgs = existingProduct.gallery_imgs || [];
        }


        // ✅ Parse JSON fields safely
        try {
            if (req.body.dimensions) updatedProductData.dimensions = JSON.parse(req.body.dimensions);
            if (req.body.tags) updatedProductData.tags = Array.isArray(req.body.tags) ? req.body.tags : JSON.parse(req.body.tags);
        } catch (error) {
            return res.status(400).json({ message: "❌ Invalid JSON format" });
        }

        // ✅ Update product details
        const updatedProduct = await Product.findByIdAndUpdate(productId, updatedProductData, { new: true });
        console.log("✅ Product Updated:", updatedProduct);

        console.log('typeof',typeof req.body.variants)

        // ✅ Handle variants processing
        if (req.body.variants) {
            let variantData = req.body.variants;
            console.log("🔍 Parsed Variants Data:", variantData);

            const existingVariants = await Variant.find({ product_id: updatedProduct._id });
            const existingVariantIds = existingVariants.map(v => v._id.toString());

            const variantIds = [];
            const bulkOperations = [];

            for (const [index, variant] of variantData.entries()) {
                if (!variant._id) variant._id = new mongoose.Types.ObjectId();
                variantIds.push(variant._id);

                let variantImgPath = existingVariants.find(v => v._id.toString() === variant._id)?.variant_img || "";
                if (req.files.find(file => file.fieldname === `variant_img_${index}`)) {
                    if (variantImgPath) removeOldImage(variantImgPath);
                    variantImgPath = `/uploads/${req.files.find(file => file.fieldname === `variant_img_${index}`).filename}`;
                }

                let variantGalleryPaths = existingVariants.find(v => v._id.toString() === variant._id)?.variant_gallery_imgs || [];
                if (req.files.find(file => file.fieldname === `variant_gallery_imgs_${index}`)) {
                    if (variantGalleryPaths.length > 0) variantGalleryPaths.forEach(removeOldImage);
                    variantGalleryPaths = req.files
                        .filter(file => file.fieldname === `variant_gallery_imgs_${index}`)
                        .map(file => `/uploads/${file.filename}`);
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
                                variant_img: variantImgPath || variant.variant_img,
                                variant_gallery_imgs: variantGalleryPaths || variant.variant_gallery_imgs,
                            },
                        },
                    });
                } else {
                    console.log("➕ Creating New Variant:", variant);
                    bulkOperations.push({
                        insertOne: {
                            document: {
                                ...variant,
                                product_id: updatedProduct._id,
                                variant_img: variantImgPath,
                                variant_gallery_imgs: variantGalleryPaths,
                            },
                        },
                    });
                }
            }

            // ✅ Execute bulk write for variants
            if (bulkOperations.length > 0) {
                const bulkResult = await Variant.bulkWrite(bulkOperations);
                console.log("✅ BulkWrite Result:", bulkResult);
            }

            // ✅ Update the product with new variant IDs
            updatedProduct.variants = variantIds;
            await updatedProduct.save();

            // ✅ Delete removed variants
            const deleteResult = await Variant.deleteMany({
                product_id: updatedProduct._id,
                _id: { $nin: variantIds },
            });
            console.log("🗑️ Deleted Variants Result:", deleteResult);
        }

        res.status(200).json({ message: "✅ Product updated successfully", product: updatedProduct });
    } catch (err) {
        console.error("❌ Error:", err);
        res.status(500).json({ message: "❌ Internal Server Error", error: err.message });
    }
};

// ✅ Utility function to remove old images from the server
function removeOldImage(imagePath) {
    if (!imagePath) return;
    const fullPath = path.join(__dirname, "..", imagePath);
    if (fs.existsSync(fullPath)) {
        fs.unlink(fullPath, err => {
            if (err) console.error("❌ Error deleting file:", fullPath, err);
            else console.log("🗑️ Deleted old image:", fullPath);
        });
    }
}

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