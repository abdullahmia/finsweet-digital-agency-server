const Comment = require('../models/Comment');


module.exports.createComment = async (req, res) => {
    try {
        const { article, name, email, body } = req.body;
        if (!article || !name || !email || !body) {
            return res.status(404).json({ message: `Field required!` })
        }

        const comment = new Comment({article, name, email, body});
        await comment.save();
        return res.status(200).json({message: 'Comment has been created!', comment});

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

// get all comments with pagination
module.exports.getComments = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const total = await Comment.countDocuments();
        const totalPages = Math.ceil(total / limit);
        const comments = await Comment.find({}).skip(skip).limit(limit).sort({ createdAt: -1 }).populate('article');
        return res.status(200).json({ comments, totalPages });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}