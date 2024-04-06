const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cepSchema = new Schema({
    bairro: {
        type: String,
        required: true
    },
    cep_number: {
        type: String,
        required: true
    },
    localidade: {
        type: String,
        required: true
    },
    logradouro: {
        type: String,
        required: true
    },
    number: {
        type: String,
        required: true
    },
    uf: {
        type: String,
        required: true
    },
}, { _id: false });

const itemSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
}, { _id: false });

const identitySchema = new Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    telefone: {
        type: String,
        required: true
    },
    cpf: {
        type: String,
        required: true
    },
    cep_location: {
        type: cepSchema,
        required: true
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

