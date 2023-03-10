const Contact = require('../models/Contact');
const Notification = require('../models/Notification');
const User = require('../models/User');


module.exports.addContact = async (req, res) => {
    try {
        const {name, email, category, subject, message} = req.body;
        if (!name || !email || !category || !subject || !message) {
            return res.status(400).json({msg: 'Please fill in all fields'})
        }
        const contact = new Contact({name, email, category, subject, message});
        await contact.save();

        // send message to admin via socket.io
        global.io.emit('newContact', contact);

        // get admin id from database
        const admin = await User.findOne({role: 'admin'});

        // Add contact notification data to the database
        const notification = new Notification({
            type: 'message',
            message: `${name} has sent you a message!`,
            link: '/admin/messages',
            recipient: admin._id,
        })
        await notification.save();
        global.io.emit('newNotification', notification);

        return res.status(200).json({msg: 'Message sent successfully!'})
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
}


module.exports.getContacts = async (req, res) => {
    try {
        const contacts = await Contact.find({}).sort('-createdAt');
        return res.status(200).json(contacts)
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
}


module.exports.deleteContact = async (req, res) => {
    try {
        await Contact.findByIdAndDelete(req.params.id);
        return res.status(200).json({msg: 'Message deleted successfully!'})
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
}