const { Schema, model } = require('mongoose');
const brcypt = require('bcryptjs');


// user schema
const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        min: 2,
        max: 20
    },
    lastName: {
        type: String,
        required: true,
        min: 2,
        max: 20
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    phone: String,
    image: String,
    birthday: String,
    gender: String
}, {timestamps: true});


// validate the password when user login
userSchema.methods.isValidatePassword = async function (password) {
    const user = this;
    const isValidate = await brcypt.compare(password, user.password);
    return isValidate;
}


const User = model('User', userSchema);
module.exports = User;