const jwt = require('jsonwebtoken');

module.exports.genarateToken = ({ payload, expiresIn }) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: expiresIn
    })
}