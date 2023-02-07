const { Schema, model, Types } = require('mongoose');


// make a notification schema
const notificationSchema = new Schema({
    // the user who is receiving the notification
    recipient: {
        type: Types.ObjectId,
        ref: 'User'
    },
    // the user who sent the notification
    sender: {
        type: Types.ObjectId,
        ref: 'User'
    },
    // notification for what type of event
    type: {
        type: String,
        enum: ['article', 'order', 'message', 'role']
    },
    // the article or order that the notification is for
    article: {
        type: Types.ObjectId,
        ref: 'Article'
    },
    order: {
        type: Types.ObjectId,
        ref: 'Order'
    },
    // the message that the notification is for
    message: {
        type: Types.ObjectId,
        ref: 'Message'
    },
}, {timestamps: true});

// export the notification model
module.exports = model('Notification', notificationSchema);