const jwt = require('jsonwebtoken');

module.exports.genarateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })
}