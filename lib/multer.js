const multer = require('multer');
const path = require('path');


// storage engine
const storage = multer.diskStorage({});


let isValidateFile = function (file, cb) {
    let allowedFileTypes = /jpeg|jpg|png/;
    const extension = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedFileTypes.test(file.mimetype);

    if (extension && mimeType) {
        return cb(null, true);
    } else {
        cb('Invalid file type. Only JPEG, PNG file are allowed. ');
    }

}

const uploader = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
        isValidateFile(file, callback);
    }
})

module.exports = uploader;