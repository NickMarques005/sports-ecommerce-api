//---user.js---//

const mongoose = require('mongoose');

const { Schema } = mongoose;

//Schema User for Registration:
const userSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    cep_location:{
        type: Object,
        required: true
    },
    email:{
        type:String,
        required: true
    },
    password:{
        type:String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('user', userSchema, 'forms_data');