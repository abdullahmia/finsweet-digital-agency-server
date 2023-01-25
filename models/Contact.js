const { Schema, model } = require('mongoose');


// contact schema
const contactShema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
}, {timestamp: true})


const Contact = model('Contact', contactShema);
module.exports = Contact;