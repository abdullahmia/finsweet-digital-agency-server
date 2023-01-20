const { ArticleCategory } = require("../models/Categories");
const cloudinary = require('../lib/cloudinary');
const Article = require('../models/Article');


/**
 * @description This API is used to Create New Article.
 * @Route  POST /api/article
 * @Access Admin
 * @returns {Object} - Created Article.
 */
module.exports.createArticle = async (req, res) => {
    try {
        const { title, categories, image, shortDescription, description, tags} = req.body;
        // upload image on cloudinary
        const uploadedImage = await cloudinary.uploader.upload(image, {folder: 'agency/articles', crop: 'scale'});

        const addArticle = new Article({title, author: req.user._id, categories, shortDescription, description, tags, image: uploadedImage.public_id});

        await addArticle.save();
        return res.status(200).json({message: 'Article has been added!', article: addArticle});

        res.send(title);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

/**
 * @description This API is used to Fetch All Article.
 * @Route GET /api/article
 * @Access PUBLIC
 * @returns {Object} - Created Articles.
 */
module.exports.getArtilces = async (req, res) => {
    try {
        // get all articles with pagination & page limit

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const total = await Article.countDocuments();
        const totalPages = Math.ceil(total / limit);
        // all articles with pagination & populate author without password & email & categories
        const articles = await Article.find({}).skip(skip).limit(limit).populate('author', '-password -email').populate('categories').sort({createdAt: -1});
        return res.status(200).json({articles, totalPages});
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}


/**
 * @description This API is used to Create New Category.
 * @Route  POST /api/article/category
 * @Access Admin
 * @returns {Object} - Created Category.
 */
module.exports.createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(404).json({ message: `Field required!` })
        }

        const category = new ArticleCategory({ name });
        await category.save();

        // return created category with how many articles in each category with created date
        const createdCategory = await ArticleCategory.aggregate([
            {
                $match: {
                    _id: category._id
                }
            },
            {
                $lookup: {
                    from: 'articles',
                    localField: '_id',
                    foreignField: 'categories',
                    as: 'articles'
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    slug: 1,
                    createdAt: 1,
                    articles: {
                        $size: '$articles'
                    }
                }
            }
        ]);

        return res.status(200).json(createdCategory);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}


/**
 * @description This API is used to Fetch All Article Categories.
 * @Route GET /api/article/category
 * @Access public
 * @returns {Object} - Created Categories.
 */
module.exports.getAllCategories = async (req, res) => {
    try {
        // get all categories with how many articles in each category with created date
        const categories = await ArticleCategory.aggregate([
            {
                $lookup: {
                    from: 'articles',
                    localField: '_id',
                    foreignField: 'categories',
                    as: 'articles'
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    slug: 1,
                    createdAt: 1,
                    articles: {
                        $size: '$articles'
                    }
                }
            }
        ]);

        return res.status(200).json(categories);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

/**
 * @description This API is used to update single product.
 * @Route PUT /api/article/category/:slug
 * @Access ADMIN
 * @returns {Object} - Updated Data.
 * @param {String} slug - Category slug.
 */

module.exports.updateCategory = async (req, res) => {
    try {
        const {slug} = req.params;
        const {name} = req.body;
        if (!name) {
            return res.status(404).json({ message: `Field required!` })
        }
        // check if category exists
        const category = await ArticleCategory.findOne({slug: slug});
        if (!category) {        
            return res.status(404).json({ message: `Category not found!` })
        }

        // update category
        let updatedCategory = await ArticleCategory.findOneAndUpdate({slug: slug}, {name: name}, {new: true});
        await updatedCategory.save();
        return res.status(200).json({ message: `Category has been updated!`, category: updatedCategory });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}


/**
 * @description This API is used delete single article categor.
 * @Route DELETE /api/article/category/:slug
 * @Access ADMIN
 * @returns {String} - Delete Message Message.
 * @param {String} slug - Category slug.
 */
module.exports.deleteCategory = async (req, res) => {
    try {
        const {slug} = req.params;
        // check if category exists
        const category = await ArticleCategory.findOne({slug: slug});
        if (category) {
            await ArticleCategory.findOneAndDelete({slug: slug});
            return res.status(200).json({ message: `Category has been deleted!` });
        } else {
            return res.status(404).json({ message: `Category not found!` });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}