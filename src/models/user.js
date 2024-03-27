//---user.js---//

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Schema } = mongoose;

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
        required: true,
        unique: true
    },
    password:{
        type:String,
        required: true
    },
    dateCreation:{
        type: Date,
        default: Date.now()
    }
});

userSchema.pre('save', async function (next) {
    if(!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(15);
    this.password = await bcrypt.hash(this.password, salt);

    next();
});

userSchema.methods.comparePassword = async function(token) {
    const result = await bcrypt.compareSync(token, this.password);
    return result;
}


const User = mongoose.model('user', userSchema, 'forms_data');

module.exports = User;