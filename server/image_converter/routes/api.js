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
/**
 *? upload an image, stores it into images directory, convert it into gcode and store the file into gcodes directory
 *? expects an image in the request
 *! NOT working with it anymore
 */
router.post('/convert-1', auth, upload.single('image'), (req, res) => {
    //? req.file {fieldname, originalname, encoding, mimetype, buffer}
    const fileObject = req.file;
    let results = null;
    const params = req.body.parameters;
    filesHandler.moveImage(fileObject.path, fileObject.filename)
        .then((newPath) => {
            controller.defaultImageConversion(newPath, params)
                .then((data) => {
                    results = data;
                    //? filename ex 2019-02-24T16:25:36.772Z.gcode
                    const splitted = fileObject.filename.split(".");
                    //? splitted[0] + "." + splitted[1] => 2019-02-24T16:25:36 + 772Z
                    const fileName = splitted[0] + "." + splitted[1] + ".gcode";
                    filesHandler.moveDotGcode(data.dirgcode, fileName)
                        .then((result) => {
                            const tt = new Date(Date.now());
                            const endTime = `${tt.getHours()}:${tt.getMinutes()}:${tt.getSeconds()}`;
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
                            const t = new Date(time);
                            const startTime = `${t.getHours()}:${t.getMinutes()}:${t.getSeconds()}`;
                            controller.storeConversionDetails({
                                image: fileObject.filename,
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
                                filesHandler.getGCodeFileStats(fileName)
                                    .then((result) => {
                                        let size = result.size;
                                        // console.log();
                                        res.send({
                                            success: "Operation Completed Successfully, Image Conversion is Done",
                                            data: {
                                                toolDiameter,
                                                sensitivity,
                                                scaleAxes,
                                                deepStep,
                                                whiteZ,
                                                blackZ,
                                                safeZ,
                                                feedrate,
                                                errBlackPixel,
                                                imgSize,
                                                startTime,
                                                endTime,
                                                elapsedTime: (tt - t) * 0.001,
                                                fileName: fileName,
                                                size: size
                                            }
                                        });
                                    }).catch((error) => {
                                        console.log(error);
                                        res.status(500).send({
                                            failure: "Internal error occurred while getting file stats",
                                            error
                                        });
                                    });
                            }).catch((error) => {
                                console.log(error);
                                //! delete image
                                controller.deleteImageFileSync(fileObject.filename);
                                //! delete gcode file
                                controller.deleteGCodeFileSync(fileName);
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
                    //! delete the uploaded image here
                    controller.deleteImageFileSync(fileObject.filename);
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


/**
 * using worker in nodejs to move conversion process from the main thread
 */
router.post('/convert', auth, upload.single('image'), (req, res) => {
    //? req.file {fieldname, originalname, encoding, mimetype, buffer}
    const fileObject = req.file;
    let results = null;
    const params = req.body.parameters;
    filesHandler.moveImage(fileObject.path, fileObject.filename)
        .then((newPath) => {
            controller.workOnConvertImage(newPath, params)
                .then((data) => {
                    results = data;
                    //? filename ex 2019-02-24T16:25:36.772Z.gcode
                    const splitted = fileObject.filename.split(".");
                    //? splitted[0] + "." + splitted[1] => 2019-02-24T16:25:36 + 772Z
                    const fileName = splitted[0] + "." + splitted[1] + ".gcode";
                    filesHandler.moveDotGcode(data.dirgcode, fileName)
                        .then((result) => {
                            const tt = new Date(Date.now());
                            const endTime = `${tt.getHours()}:${tt.getMinutes()}:${tt.getSeconds()}`;
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
                            const t = new Date(time);
                            const startTime = `${t.getHours()}:${t.getMinutes()}:${t.getSeconds()}`;
                            controller.storeConversionDetails({
                                image: fileObject.filename,
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
                                filesHandler.getGCodeFileStats(fileName)
                                    .then((result) => {
                                        let size = result.size;
                                        // console.log();
                                        res.send({
                                            success: "Operation Completed Successfully, Image Conversion is Done",
                                            data: {
                                                toolDiameter,
                                                sensitivity,
                                                scaleAxes,
                                                deepStep,
                                                whiteZ,
                                                blackZ,
                                                safeZ,
                                                feedrate,
                                                errBlackPixel,
                                                imgSize,
                                                startTime,
                                                endTime,
                                                elapsedTime: (tt - t) * 0.001,
                                                fileName: fileName,
                                                size: size
                                            }
                                        });
                                    }).catch((error) => {
                                        console.log(error);
                                        res.status(500).send({
                                            failure: "Internal error occurred while getting file stats",
                                            error
                                        });
                                    });
                            }).catch((error) => {
                                console.log(error);
                                //! delete image
                                filesHandler.deleteImageFileSync(fileObject.filename);
                                //! delete gcode file
                                filesHandler.deleteGCodeFileSync(fileName);
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
                    //! delete the uploaded image here
                    filesHandler.deleteImageFileSync(fileObject.filename);
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