const jwt = require('jsonwebtoken');
const Order = require('../models/Order');

module.exports.verifyToken = token => {
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (decoded.email) {
                return true;
            }
        } catch (error) {
            return false;
        }
    }
}

// genate a random transaction id based on order model if not exist
module.exports.genarateTransactionId = () => {
    const transactionId = Math.random().toString(36).substring(2);
    const order = Order.findOne({transactionId});
    if (order) {
        return genarateTransactionId();
    }
    return transactionId;
}