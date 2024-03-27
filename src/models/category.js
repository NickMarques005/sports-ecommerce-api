const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    category: { type: String, required: true }
});

const Categories = mongoose.model('category', categorySchema, 'categoryProducts_data');

module.exports = Categories;