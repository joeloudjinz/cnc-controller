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
    filesHandler.moveImage(fileObject.path, fileObject.filename)
        .then((newPath) => {
            controller.workOnConvertImage(newPath, params, fileObject);
            res.send({
                success: "Image conversion process has started successfully"
            });
        }).catch((error) => {
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
    if (imageName) {
        if (parameters) {
            //? get image file from images directory
            filesHandler
                .getImageFile(imageName)
                .then((imagePath) => {
                    const params = JSON.stringify(parameters);
                    // console.log('params :', params);
                    controller.workOnConvertImage(imagePath, params)
                        .then((data) => {
                            //? results holds the details of the conversion process
                            results = data;
                            const splitted = imageName.split(".");
                            const fileName = splitted[0] + "." + splitted[1] + ".gcode";
                            filesHandler.moveDotGcode(data.dirgcode, fileName)
                                .then((result) => {
                                    const {
                                        toolDiameter,
                                        sensitivity,
                                        scaleAxes,
                                        deepStep,
                                        whiteZ,
                                        blackZ,
                                        safeZ,
                                        feedrate,
                                        errBlackPixel,
                                        time,
                                        imgSize
                                    } = results.config;
                                    controller.storeConversionDetails({
                                        image: imageName,
                                        gcode: fileName,
                                        toolDiameter,
                                        sensitivity,
                                        scaleAxes,
                                        deepStep,
                                        whiteZ,
                                        blackZ,
                                        safeZ,
                                        feedrate,
                                        time,
                                        errBlackPixel,
                                        imgSize
                                    }).then((result) => {
                                        res.send({
                                            success: "Image converted successfully",
                                            data: errBlackPixel
                                        });
                                    }).catch((error) => {
                                        res.status(500).send({
                                            failure: "Internal error occurred while storing data into Database, try again",
                                            error
                                        });
                                    });
                                }).catch((error) => {
                                    res.status(500).send({
                                        failure: "Internal error occurred while moving gcode to directory",
                                        error
                                    });
                                });
                        }).catch((error) => {
                            console.log(error);
                            res.status(500).send({
                                failure: "Internal error occurred while converting image, try again",
                                error
                            });
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