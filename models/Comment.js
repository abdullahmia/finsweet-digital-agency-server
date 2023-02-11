const { Schema, model, Types } = require('mongoose');

const commentSchema = new Schema({
    article: { type: Types.ObjectId, ref: 'Article' },
    name: { type: String, required: true },
    email: { type: String, required: true },
    body: { type: String, required: true },
}, {timestamps: true});

module.exports = model('Comment', commentSchema);