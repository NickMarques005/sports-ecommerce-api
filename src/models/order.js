const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
}, { _id: false });

const identitySchema = new Schema({
    telefone: {
        type: String,
    },
    cpf: {
        type: String,
    },
    cep_number: {
        type: String,
    }
}, { _id: false });

const orderSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    products: [itemSchema],
    identityData: identitySchema
}, { timestamps: true }
);

const Order = mongoose.model('order', orderSchema, 'orders_data');

module.exports = Order;

