const mongoose = require('mongoose');

const SubcategorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: String,
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }
});

module.exports = mongoose.model('Subcategory', SubcategorySchema);
