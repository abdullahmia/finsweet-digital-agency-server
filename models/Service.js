const { Schema, model } = require('mongoose');
const slugify = require("slugify");


const serviceSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    features: [
        {
            type: String,
            required: true
        }
    ],
    isFeatured: {
        type: Boolean,
        default: false
    },
    slug: {
        type: String,
        unique: true
    },
}, {timestamps: true});


// genarate unique slug based on Service name
serviceSchema.pre("save", async function (next) {
    try {
        const service = this;
        const slug = service.name.replace(/\s+/g, '-').toLowerCase();
        const serviceWithSlug = await Service.findOne({ slug });
        // genareate unique slug
        const slugRegex = new RegExp(`^(${slug})((-[0-9]*$)?)$`, "i");

        if (serviceWithSlug) {
            const slugNum = slug.match(slugRegex)[2] ? parseInt(slug.match(slugRegex)[2].slice(1)) + 1 : 1;
            service.slug = `${slug}-${slugNum}`;
        } else {
            service.slug = slug;
        }

        next();
    } catch (err) {
        next(err);
    }
});

const Service = model("Service", serviceSchema);
module.exports = Service;