const Product = require('../models/product');
const Categories = require('../models/category');
const Suggestions = require('../models/suggestion');

const collectionModels = {
    'products_data': Product,
    'categoryProducts_data': Categories,
    'suggestions_data': Suggestions
}

module.exports = collectionModels;