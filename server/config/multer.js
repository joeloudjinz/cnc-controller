const multer = require('multer');
const path = require('path');

const uploadsPath = path.join(__dirname, '..', 'resources', 'images');

module.exports = multer.diskStorage({
    destination: function (req, file, callback) {
        //? to specify the storage where the files will be uploaded
        callback(null, uploadsPath);
    },
    filename: function (req, file, callback) {
        //? extracting the extension of the image
        const ext = file.originalname.split(".").reverse()[0];
        //? reformatting the shape of the date from toISOString() call
        let time = new Date().toISOString();
        time = time.replace(/-/gi, '');
        time = time.replace(/T/gi, '-');
        time = time.replace(/:/gi, '');
        time = time.replace(/Z/gi, '');
        //? distinguishing between Z or M mode
        // TODO: add M or Z depending on the value of laserModeStatus in request body
        const {
            laserModeStatus,
            powerOff,
            powerOn
        } = req.body;
        console.log('laserModeStatus :', laserModeStatus);
        console.log('powerOff :', powerOff);
        console.log('powerOn :', powerOn);
        //? to give the file a new name
        let name;
        if (laserModeStatus === true || laserModeStatus === 'true')
            name = "M" + time + "." + ext;
        else
            name = "Z" + time + "." + ext;
        callback(null, name);
    }
});