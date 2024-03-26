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
        default: Date.now()
    }
});

userSchema.pre('save', async (next) => {
    if(this.isModified('password')) {
        const salt = await bcrypt.genSalt(15);
        const hashedToken = await bcrypt.hash(this.password, salt);

        this.password = hashedToken;
    }

    next();
});

userSchema.methods.comparePassword = async (token) => {
    const result = await bcrypt.compareSync(token, this.password);
    return result;
}

module.exports = mongoose.model('user', userSchema, 'forms_data');