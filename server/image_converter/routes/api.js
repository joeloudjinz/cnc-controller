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

const authPath = path.join('..', '..', 'middlewares', 'auth');
const auth = require(authPath);

const controllerPath = path.join('..', 'controller');
const controller = require(controllerPath);

const router = express.Router();

router.post('/convert', auth, upload.single('image'), (req, res) => {
    //? req.file {fieldname, originalname, encoding, mimetype, buffer}
    const fileObject = req.file;
    const params = req.body.parameters;
    const target = req.body.target;
    // console.log('params :', params);
    // TODO: get laserModeStatus from body
    // TODO: send laserModeStatus to worker
    controller.workOnConvertImage(fileObject.path, params, fileObject.filename, false, target);
    res.send({
        success: "Image conversion process has started successfully"
    });
    filesHandler.moveImage(fileObject.path, fileObject.filename)
        .then((newPath) => {}).catch((error) => {
            res.status(500).send({
                failure: "Internal error occurred, try again",
                error
            });
        });
});

router.post('/convert/quick', auth, (req, res) => {
    //? get image file name and params from query field
    const imageName = req.query.imageName;
    const parameters = req.body.parameters;
    const target = req.body.target;
    if (imageName) {
        if (parameters) {
            //? get image file from images directory
            filesHandler
                .getImageFile(imageName)
                .then((imagePath) => {
                    const params = JSON.stringify(parameters);
                    // TODO: get laserModeStatus from body
                    // TODO: send laserModeStatus to worker
                    controller.workOnConvertImage(imagePath, params, imageName, true, target);
                    res.send({
                        success: "Image conversion process has started successfully"
                    });
                }).catch((error) => {
                    res.status(404).send({
                        failure: "Image file does not exist!",
                        error
                    });
                });
        } else {
            res.status(404).send({
                failure: "Scale Axes is undefined",
                error
            });
        }
    } else {
        res.status(404).send({
            failure: "Image name is undefined",
            error
        });
    }
});

router.get('/count', auth, (req, res) => {
    controller
        .getConversionsCount()
        .then((result) => {
            // console.log('result :', result);
            res.send({
                success: 'Counted successfully',
                count: result
            });
        }).catch((error) => {
            console.log('in getConversionsCount(), error :', error);
            res.status(500).send({
                failure: "Couldn't count conversions counts!",
                error
            });
        });
});

module.exports = router;