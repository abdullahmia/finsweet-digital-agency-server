const brcypt = require('bcryptjs');


module.exports.hash = (password) => {
    const hash = brcypt.hash(password, 10);
    return hash;
}