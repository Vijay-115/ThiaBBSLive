const Category = require('../models/Category');
const Subcategory = require('../models/Subcategory');

// CREATE: Add a new category
exports.createCategory = async (req, res) => {
    console.log('createCategory',req.body);
    try {
        const { name, description } = req.body;

        const newCategory = new Category({ name, description });
        await newCategory.save();

        res.status(201).json(newCategory);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// READ: Get all categories
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// READ: Get a single category by ID
exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json(category);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// UPDATE: Update a category by ID
exports.updateCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        const updatedCategory = await Category.findByIdAndUpdate(
            req.params.id,
            { name, description },
            { new: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json(updatedCategory);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// DELETE: Delete a category by ID
exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        await Subcategory.deleteMany({ category_id: category._id }); // Remove associated subcategories
        await Category.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'Category and its subcategories deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};