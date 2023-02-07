const Notification = require('../models/Notification');


// get notifications by user id and user role
module.exports.getNotifications = async (req, res) => {
    try {
        const {id, role} = req.user;
        const notifications = await Notification.find({}).sort('-createdAt');
        return res.status(200).json(notifications);
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
}
