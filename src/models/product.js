const mongoose = require('mongoose');

const sizeSchema = new mongoose.Schema({
    size: Number,
    quantity: Number
}, { _id: false});

const typeSchema = new mongoose.Schema({
    imgs: [String],
    descount: Number,
    condition_price: Number,
    color: String,
    sizes: [sizeSchema]
}, { _id: false});

const productSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    rating: {
        rating_start: Number,
        rating_amount: Number
    },
    description: String,
    initial_price: Number,
    type: [typeSchema],
    new: Boolean,
    subcategory: String
});

const Products = mongoose.model('product', productSchema, 'products_data');

module.exports = Products;
