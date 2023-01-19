const {Schema, model, Types} = require('mongoose');
const slugify = require('slugify');


// article schema
const articleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    categories: [{
        type: Types.ObjectId,
        ref: 'ArticleCategory',
        required: true
    }],
    shortDescription: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    author: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    image: {
        type: String,
        required: true
    },
    tags: {
        type: Array
    }
}, {timestamps: true});

// defining the model
const Article = model('Article', articleSchema);
module.exports = Article;