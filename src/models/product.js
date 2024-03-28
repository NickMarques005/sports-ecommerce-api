const mongoose = require('mongoose');

const sizeSchema = new mongoose.Schema({
    size: mongoose.Schema.Types.Mixed,
    quantity: Number
}, { _id: false});

const typeSchema = new mongoose.Schema({
    imgs: [String],
    discount: Number,
    condition_price: Number,
    color: String,
    sizes: [sizeSchema],
    new: Boolean,
}, { _id: false});

const productSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    rating: {
        rating_stars: Number,
        rating_amount: Number
    },
    description: {
        type: String,
    },
    initial_price: {
        type: Number,
    },
    types: {
        type: [typeSchema],
    },
    subcategory: {
        type: String,
    }
});

const Products = mongoose.model('product', productSchema, 'products_data');

module.exports = Products;
