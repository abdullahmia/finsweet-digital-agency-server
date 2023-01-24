const { ProjectCategory } = require('../models/Categories');













module.exports.createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(404).json({ message: `Field required!` })
        }

        const category = new ProjectCategory({ name });
        await category.save();

        // return created category with how many project in each category with created date
        const createdCategory = await ProjectCategory.aggregate([
            {
                $match: {
                    _id: category._id
                }
            },
            {
                $lookup: {
                    from: 'projects',
                    localField: '_id',
                    foreignField: 'categories',
                    as: 'projects'
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    slug: 1,
                    createdAt: 1,
                    project: {
                        $size: '$projects'
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
        // get all categories with how many project in each category with created date
        const categories = await ProjectCategory.aggregate([
            {
                $lookup: {
                    from: 'projects',
                    localField: '_id',
                    foreignField: 'categories',
                    as: 'projects'
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    slug: 1,
                    createdAt: 1,
                    project: {
                        $size: '$projects'
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
        const { id } = req.params;
        const { name } = req.body;
        if (!name) {
            return res.status(404).json({ message: `Field required!` })
        }
        // check if category exists
        const category = await ProjectCategory.findOne({ _id: id });
        if (!category) {
            return res.status(404).json({ message: `Category not found!` })
        }

        // update category
        let updatedCategory = await ProjectCategory.findOneAndUpdate({ _id: id }, { name: name }, { new: true });
        await updatedCategory.save();
        return res.status(200).json({ message: `Category has been updated!`, category: updatedCategory });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}


module.exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        // check if category exists
        const category = await ProjectCategory.findOne({ _id: id});
        if (category) {
            await ProjectCategory.findOneAndDelete({ _id: id });
            return res.status(200).json({ message: `Category has been deleted!` });
        } else {
            return res.status(404).json({ message: `Category not found!` });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}