const Subcategory = require('../models/Subcategory');
const Category = require('../models/Category');

// CREATE: Add a new subcategory under a category
exports.createSubcategory = async (req, res) => {
    try {
        const { name, description, category_id } = req.body;

        const category = await Category.findById(category_id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        const newSubcategory = new Subcategory({ name, description, category_id });
        await newSubcategory.save();

        res.status(201).json(newSubcategory);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// READ: Get all subcategories
exports.getAllSubcategories = async (req, res) => {
    try {
        const subcategories = await Subcategory.find().populate('category_id'); // .populate('category_id')
        res.status(200).json(subcategories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// READ: Get a single subcategory by ID
exports.getSubcategoryById = async (req, res) => {
    try {
        const subcategory = await Subcategory.findById(req.params.id).populate('category_id');
        if (!subcategory) {
            return res.status(404).json({ message: 'Subcategory not found' });
        }
        res.status(200).json(subcategory);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// UPDATE: Update a subcategory by ID
exports.updateSubcategory = async (req, res) => {
    try {
        const { name, description, category_id } = req.body;

        const updatedSubcategory = await Subcategory.findByIdAndUpdate(
            req.params.id,
            { name, description, category_id },
            { new: true }
        ).populate('category_id');

        if (!updatedSubcategory) {
            return res.status(404).json({ message: 'Subcategory not found' });
        }

        res.status(200).json(updatedSubcategory);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// DELETE: Delete a subcategory by ID
exports.deleteSubcategory = async (req, res) => {
    try {
        const subcategory = await Subcategory.findById(req.params.id);
        if (!subcategory) {
            return res.status(404).json({ message: 'Subcategory not found' });
        }

        await Subcategory.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'Subcategory deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};