const { Schema, model } = require('mongoose');
const slugify = require("slugify");


const ServiceSchema = new Schema({
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


// genarate unique slug for each service based on name
ServiceSchema.pre("save", function(next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

const Service = model("Service", ServiceSchema);
module.exports = Service;