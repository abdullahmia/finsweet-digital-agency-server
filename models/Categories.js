const { Schema, model } = require('mongoose');
const slugify = require('slugify');

// Article category schema
const articleCategorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        unique: true
    }
}, {timestamps: true});

// slug
articleCategorySchema.pre('save', function (next) {
    this.slug = slugify(this.name.toLowerCase());
    next();
})


// Article Category Model
const ArticleCategory = model('ArticleCategory', articleCategorySchema);
module.exports = {ArticleCategory};