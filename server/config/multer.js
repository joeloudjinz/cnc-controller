const multer = require('multer');
const path = require('path');

const uploadsPath = path.join(__dirname, '..', 'resources', 'uploads');

module.exports = multer.diskStorage({
    destination: function (req, file, callback) {
        //? to specify the storage where the files will be uploaded
        callback(null, uploadsPath);
    },
    filename: function (req, file, callback) {
        //? extracting the extension of the image
        const ext = file.originalname.split(".").reverse()[0];
        //? to give the file a new name
        callback(null, new Date().toISOString() + "." + ext);
    }
});