const Service = require('../models/Service');


module.exports.createService = async (req, res) => {
    try {
        const { name, description, price, features, isFeatured } = req.body;
        if (!name || !description || !price || !features) {
            return res.status(400).json({message: "All fields are required."})
        }

        // create a new service
        const service = new Service({name, description, price, features, isFeatured});
        await service.save();
        return res.status(201).json({message: "Service created successfully.", service})
    } catch (err) {
        return res.status(500).json({message: err.message})
    }
}

module.exports.getServices = async (req, res) => {
    try {
        const services = await Service.find({});
        return res.status(200).json({services})
    } catch (err) {
        return res.status(500).json({message: err.message})
    }
}


module.exports.updateService = async (req, res) => {
    try {
        const {id} = req.params;

        let service = await Service.findOne({_id: id});
        if (!service) {
            return res.status(404).json({message: "Service not found."})
        }

        service = await Service.findOneAndUpdate({_id: id}, {...req.body}, {new: true});
        return res.status(200).json({message: "Service updated successfully.", service})

    } catch (err) {
        return res.status(500).json({message: err.message})
    }
}



module.exports.deleteService = async (req, res) => {
    try { 
        const {id} = req.params;
        let service = await Service.findOne({ _id: id });
        if (!service) {
            return res.status(404).json({ message: "Service not found." })
        }

        await Service.findOneAndDelete({_id: id});
        return res.status(200).json({message: "Service deleted successfully."})

    } catch (err) {
        return res.status(500).json({message: err.message})
    }
}