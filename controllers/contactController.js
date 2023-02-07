const Contact = require('../models/Contact');


module.exports.addContact = async (req, res) => {
    try {
        const {name, email, category, subject, message} = req.body;
        if (!name || !email || !category || !subject || !message) {
            return res.status(400).json({msg: 'Please fill in all fields'})
        }
        const contact = new Contact({name, email, category, subject, message});
        await contact.save();
        return res.status(200).json({msg: 'Message sent successfully!'})
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
}


module.exports.getContacts = async (req, res) => {
    try {
        const contacts = await Contact.find().sort('-createdAt');
        return res.status(200).json(contacts)
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
}