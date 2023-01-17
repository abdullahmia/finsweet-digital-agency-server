const jwt = require('jsonwebtoken');

module.exports.verifyToken = token => {
    if (token) {
        try {
            console.log("kire eita token");
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (decoded.email) {
                return true;
            }
        } catch (error) {
            return false;
        }
    }
}