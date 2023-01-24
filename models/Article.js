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
    },
    slug: {
        type: String,
        unique: true
    }
}, {timestamps: true});


// genarate unique slug based on title
articleSchema.pre('save', async function (next) {
    try {
        const article = this;
        const slug = slugify(article.title, {lower: true});
        const articleWithSlug = await Article.findOne({slug});
        if (articleWithSlug) {
            article.slug = `${slug}-${articleWithSlug._id}`;
        } else {
            article.slug = slug;
        }
        next();
    } catch (err) {
        next(err);
    }
});

// defining the model
const Article = model('Article', articleSchema);
module.exports = Article;