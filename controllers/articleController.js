const { ArticleCategory } = require("../models/Categories");
const cloudinary = require('../lib/cloudinary');
const Article = require('../models/Article');


module.exports.createArticle = async (req, res) => {
    try {
        const { title, categories, image, shortDescription, description, tags} = req.body;
        // upload image on cloudinary
        const uploadedImage = await cloudinary.uploader.upload(image, {folder: 'agency/articles', crop: 'scale'});

        const addArticle = new Article({title, author: req.user._id, categories, shortDescription, description, tags, image: uploadedImage.public_id});
        await addArticle.save();

        // get the created article with populate author without password & email & categories
        const article = await Article.findOne({_id: addArticle._id}).populate('author', '-password -email').populate('categories');

        return res.status(200).json({message: 'Article has been added!', article});

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message });
    }
}

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


module.exports.getArticle = async (req, res) => {
    try {
        const {slug} = req.params;
        const article = await Article.findOne({ slug }).populate('author', '-password -email').populate('categories');
        if (!article) {
            return res.status(404).json('Not Found');
        }
        return res.status(200).json(article);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}



module.exports.deleteArticle = async (req, res) => {
    try {
        const {slug} = req.params;
        const article = await Article.findOne({slug});
        if (!article) {
            return res.status(404).json({message: 'Article not found!'});
        }

        // delete image from cloudinary
        await cloudinary.uploader.destroy(article.image);

        await article.remove();
        // return delete response with delete message & deleted item
        return res.status(200).json({message: 'Article has been deleted!', article});

    }catch (err) {
        return res.status(500).json({ message: err.message });
    }
}



module.exports.updateArticle = async (req, res) => {
    try {
        let article;
        const {id} = req.params;
        const {title, categories, image, shortDescription, description, tags} = req.body;
        const isArticle = await Article.findOne({_id: id});
        if (!isArticle) {
            return res.status(404).json({message: 'Article not found!'});
        }

        // if image is not changed then update other fields
        if (image === null) {
            article = await Article.findOneAndUpdate({_id: id}, {title, categories, shortDescription, description, tags}, {new: true}).populate('author', '-password -email').populate('categories');

        } else {
            // delete old image from cloudinary
            await cloudinary.uploader.destroy(image);
            // upload new image on cloudinary
            const uploadedImage = await cloudinary.uploader.upload(image, {folder: 'agency/articles', crop: 'scale'});
            article = await Article.findOneAndUpdate({ _id: id }, { title, categories, shortDescription, description, tags, image: uploadedImage.public_id}).populate('author', '-password -email').populate('categories');
        }
        
        return res.status(200).json({message: 'Article has been updated!', article});

    }catch (err) {
        return res.status(500).json({ message: err.message });
    }

}


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