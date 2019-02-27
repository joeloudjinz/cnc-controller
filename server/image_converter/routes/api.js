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
 * upload an image, store it into images directory, convert it into gcode and store the file into gcodes directory
 * expects an image in the request
 */
router.post('/convert', upload.single('image'), (req, res) => {
    //? req.file {fieldname, originalname, encoding, mimetype, buffer}
    const fileObject = req.file;
    let results = null;
    filesHandler.moveImage(fileObject.path, fileObject.filename)
        .then((newPath) => {
            controller.defaultImageConversion(newPath, 212)
                .then((data) => {
                    results = data;
                    //? filename ex 2019-02-24T16:25:36.772Z.gcode
                    const splitted = fileObject.filename.split(".");
                    //? splitted[0] + "." + splitted[1] => 2019-02-24T16:25:36 + 772Z
                    const fileName = splitted[0] + "." + splitted[1];
                    filesHandler.moveDotGcode(data.dirgcode, fileName)
                        .then((result) => {
                            const tt = new Date(Date.now());
                            const endTime = `${tt.getHours()}:${tt.getMinutes()}:${tt.getSeconds()}`;
                            console.log(results.config);
                            console.log(endTime);
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
                            res.send({
                                success: "Operation completed successfully, Image Conversion is Done",
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
                                    fileName: `${fileName}.gcode`
                                }
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
                    })
                });
        }).catch((error) => {
            res.status(500).send({
                failure: "Internal error occurred, try again",
                error
            });
        });

});

module.exports = router;