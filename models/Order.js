const { Schema, model, Types } = require('mongoose');


// make a order schema based on service schema
const orderSchema = new Schema({
    service: {
        type: Types.objectId,
        ref: 'Service'
    },
    user: {
        type: Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['pending', 'in progress', 'completed'],
        default: 'pending'
    },
    transactionId: {
        type: String,
        unique: true
    },
    sessionKey: String,
}, {timestamps: true});

// export the order model
module.exports = model('Order', orderSchema);