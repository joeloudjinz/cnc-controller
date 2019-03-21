//TODO: prepare work space
const express = require('express');
const path = require('path');

const fileHandlerPath = path.join('..', '..', 'files_handler', 'files.js');
const filesHandler = require(fileHandlerPath);

const controllerPath = path.join('..', 'controller');
const controller = require(controllerPath);

// const fileName = "sm-sample";
// const portName = '/dev/ttyACM0';

const router = express.Router();

//TODO: store transmission data into transmission table
//TODO: add auth middleware
router.post('/draw/complete', (req, res) => {
    const {
        portName,
        fileName
    } = req.body;
    if (portName) {
        if (fileName) {
            controller.openPort(portName).then((result) => {
                console.log('openPort result :', result);
                controller.initializeDelimiterParser(portName).then((result) => {
                    console.log('initializeDelimiterParser result :', result);
                    controller.registerOnDataEvent(portName).then(() => {
                        console.log('registerOnDataEvent result : ok');
                        filesHandler.addOutputDirectory("" + Date.now()).then((dirPath) => {
                            console.log('addOutputDirectory result :', dirPath);
                            filesHandler.getGcodeFile(fileName).then((filePath) => {
                                console.log('getGcodeFile result :', result);
                                controller.readGcodeFileLines(dirPath, filePath, fileName, true).then((result) => {
                                    console.log('readGcodeFileLines result :', result);
                                    const t = Date.now();
                                    filesHandler.logMessage(dirPath, t, "Starting Gcode Transmission ");
                                    filesHandler.logMessage(dirPath, t, "file: " + filePath);
                                    controller.startSendingProcess(portName, dirPath, t);
                                    res.send({
                                        success: 'GCode transmission has started successfully'
                                    });
                                }).catch((error) => {
                                    console.log('readGcodeFileLines error :', error);
                                    //! close port
                                    controller.closePort(portName).then((result) => {
                                        res.status(500).send({
                                            operation: 'Reading file lines',
                                            failure: error
                                        });
                                    }).catch((error) => {
                                        console.log('closePort in readGcodeFileLines catch, error :', error);
                                    });
                                });
                            }).catch((error) => {
                                console.log('getGcodeFile error :', error);
                                //! close port
                                controller.closePort(portName).then((result) => {
                                    res.status(500).send({
                                        operation: 'Getting gcode file',
                                        failure: error
                                    });
                                }).catch((error) => {
                                    console.log('closePort in getGcodeFile catch, error :', error);
                                });
                            });
                        }).catch((error) => {
                            console.log('addOutputDirectory error :', error);
                            //! close port
                            controller.closePort(portName).then((result) => {
                                res.status(500).send({
                                    operation: 'Creating output directory',
                                    failure: error
                                });
                            }).catch((error) => {
                                console.log('closePort in addOutputDirectory catch, error :', error);
                            });
                        });
                    }).catch((error) => {
                        console.log('registerOnDataEvent error :', error);
                        //! close port
                        controller.closePort(portName).then((result) => {
                            res.status(500).send({
                                operation: 'Registering on Data event for the port',
                                failure: error
                            });
                        }).catch((error) => {
                            console.log('closePort in registerOnDataEvent catch, error :', error);
                        });
                    });
                }).catch((error) => {
                    console.log('initializeDelimiterParser error :', error);
                    //! close port
                    controller.closePort(portName).then((result) => {
                        res.status(500).send({
                            operation: 'Initializing delimiter parser for port',
                            failure: error
                        });
                    }).catch((error) => {
                        console.log('closePort in initializeDelimiterParser catch, error :', error);
                    });
                });
            }).catch((error) => {
                console.log(error);
                res.status(500).send({
                    operation: 'Opening port',
                    failure: error
                });
            });
        } else {
            res.status(404).send({
                failure: 'Gcode file name is undefined',
            });
        }
    } else {
        res.status(404).send({
            failure: 'Port name is undefined',
        });
    }
});

//TODO: create open port api endpoint
//TODO: create close port api endpoint
//TODO: create write to port api endpoint

module.exports = router;