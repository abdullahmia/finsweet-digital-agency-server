const { Schema, model, Types } = require('mongoose');


// project schema
const projectSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    category: {
        type: Types.ObjectId,
        ref: 'ProjectCategory',
        required: true
    },
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
    images: {
        type: [String],
        required: true
    },
    slug: {
        type: String,
    },
    tags: {
        type: [String],
        required: true
    },

}, { timestamps: true });


// uniqe slug genarate based on title
projectSchema.pre('save', async function (next) {
    try {
        const project = this;
        const slug = project.title.replace(/\s+/g, '-').toLowerCase();
        const projectWithSlug = await Project.findOne({ slug });
        if (projectWithSlug) {
            project.slug = `${slug}-${projectWithSlug._id}`;
        } else {
            project.slug = slug;
        }
        next();
    } catch (err) {
        next(err);
    }
});


const Project = model('Project', projectSchema);
module.exports = Project;