const express = require('express');
const path = require('path');
const multer = require('multer');

const fileHandlerPath = path.join('..', '..', 'files_handler', 'files');
const filesHandler = require(fileHandlerPath);

const multerConfigurationPath = path.join('..', '..', 'config', 'multer');
const multerConfiguration = require(multerConfigurationPath);
const upload = multer({
    storage: multerConfiguration
});


const controllerPath = path.join('..', 'controller');
const controller = require(controllerPath);

const router = express.Router();
/**
 * upload an image, store it into images directory, convert it into gcode and store the file int gcodes directory
 * expects an image in the request
 */
router.post('/upload', upload.single('image'), (req, res) => {
    //? req.file {fieldname, originalname, encoding, mimetype, buffer}
    const fileObject = req.file;

    filesHandler.moveImage(fileObject.path, fileObject.filename)
        .then((newPath) => {
            controller.defaultImageConversion(newPath, 212)
                .then((result) => {
                    //? filename ex 2019-02-24T16:25:36.772Z.gcode
                    const splitted = fileObject.filename.split(".");
                    //? splitted[0] + "." + splitted[1] => 2019-02-24T16:25:36 + 772Z
                    const fileName = splitted[0] + "." + splitted[1];
                    filesHandler.moveDotGcode(result.dirgcode, fileName)
                        .then((result) => {
                            res.send({
                                success: "Operation completed successfully, Image Conversion is Done",
                                result
                            });
                        }).catch((error) => {
                            res.status(500).send({
                                failure: "Internal error occurred while moving gcode to directory",
                                error
                            });
                        });
                }).catch((error) => {
                    res.status(500).send({
                        failure: "Internal error occurred while converting image, try again",
                        error
                    });
                });
        }).catch((error) => {
            res.status(500).send({
                failure: "Internal error occurred, try again",
                error
            });
        });

});

module.exports = router;