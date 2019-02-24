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

router.post('/upload', upload.single('image'), (req, res) => {
    //? req.file {fieldname, originalname, encoding, mimetype, buffer}
    const fileObject = req.file;

    filesHandler.moveImage(fileObject.path, fileObject.filename)
        .then((newPath) => {
            controller.defaultImageConversion(newPath, 1280)
                .then((result) => {
                    res.send({
                        result
                    })
                }).catch((error) => {
                    res.send({
                        error
                    })
                });
        }).catch((error) => {
            res.send({
                error
            })
        });

});

module.exports = router;