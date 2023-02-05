const { Schema, model, Types } = require('mongoose');


// make a order schema based on service schema
const orderSchema = new Schema({
    service: [
        {
            type: Types.ObjectId,
            ref: 'Service'
        },
    ],
    user: {
        type: Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['pending', 'in progress', 'completed'],
        default: 'pending'
    }
}, {timestamps: true});

// export the order model
module.exports = model('Order', orderSchema);