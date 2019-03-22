//TODO: prepare work space
const express = require('express');
const path = require('path');

const fileHandlerPath = path.join('..', '..', 'files_handler', 'files.js');
const filesHandler = require(fileHandlerPath);

const controllerPath = path.join('..', 'controller');
const controller = require(controllerPath);


const router = express.Router();

/**
 * Endpoint for full draw operation, including opening a given port and registering onData event alogn with initializing a parser,
 * creating output directory and logging file, and at last, launching gcode send process
 * @param portName name of the port
 * @param fileName name of gcode file
 * @returns success response if operation started
 * @returns [500] with a failure response if one operation didn't executed successfully and closes the port if opned
 * @returns [404] if one of the params is undefined, along with a failure message
 * TODO: store transmission data into transmission table
 * TODO: add auth middleware 
 */
router.post('/draw/complete', (req, res) => {
    const {
        portName,
        fileName
    } = req.body;
    if (portName) {
        if (fileName) {
            controller.openPort(portName).then((result) => {
                controller.initializeDelimiterParser(portName).then((result) => {
                    controller.registerOnDataEvent(portName).then(() => {
                        filesHandler.addOutputDirectory("" + Date.now()).then((dirPath) => {
                            filesHandler.getGcodeFile(fileName).then((filePath) => {
                                controller.readGcodeFileLines(dirPath, filePath, fileName, true).then((result) => {
                                    const t = Date.now();
                                    filesHandler.logMessage(dirPath, t, "Starting Gcode Transmission ");
                                    filesHandler.logMessage(dirPath, t, "file: " + filePath);
                                    controller.startSendingProcess(portName, dirPath, t);
                                    res.send({
                                        success: 'GCode transmission has started successfully'
                                    });
                                }).catch((error) => {
                                    const preError = error;
                                    controller.closePort(portName).then((result) => {
                                        res.status(500).send({
                                            operation: 'Reading file lines',
                                            failure: preError,
                                            isPortClosed: true
                                        });
                                    }).catch((error) => {
                                        controller.closePort(portName).then((result) => {
                                            res.status(500).send({
                                                operation: 'Reading file lines',
                                                failure: preError,
                                                isPortClosed: false
                                            });
                                        });
                                    });
                                }).catch((error) => {
                                    const preError = error;
                                    controller.closePort(portName).then((result) => {
                                        res.status(500).send({
                                            operation: 'Getting gcode file',
                                            failure: preError,
                                            isPortClosed: true
                                        });
                                    }).catch((error) => {
                                        res.status(500).send({
                                            operation: 'Getting gcode file',
                                            failure: preError,
                                            isPortClosed: false
                                        });
                                    });
                                });
                            }).catch((error) => {
                                // console.log('addOutputDirectory error :', error);
                                const preError = error;
                                controller.closePort(portName).then((result) => {
                                    res.status(500).send({
                                        operation: 'Creating output directory',
                                        failure: preError,
                                        isPortClosed: true
                                    });
                                }).catch((error) => {
                                    // console.log('closePort in addOutputDirectory catch, error :', error);
                                    res.status(500).send({
                                        operation: 'Creating output directory',
                                        failure: preError,
                                        isPortClosed: false
                                    });
                                });
                            });
                        }).catch((error) => {
                            const preError = error;
                            controller.closePort(portName).then((result) => {
                                res.status(500).send({
                                    operation: 'Registering on Data event for the port',
                                    failure: preError,
                                    isPortClosed: true
                                });
                            }).catch((error) => {
                                res.status(500).send({
                                    operation: 'Initializing delimiter parser for port',
                                    failure: preError,
                                    isPortClosed: false
                                });
                            });
                        });
                    }).catch((error) => {
                        const preError = error;
                        controller.closePort().then((result) => {
                            res.status(500).send({
                                operation: 'Initializing delimiter parser for port',
                                failure: preError,
                                isPortClosed: true
                            });
                        }).catch((error) => {
                            res.status(500).send({
                                operation: 'Initializing delimiter parser for port',
                                failure: preError,
                                isPortClosed: false
                            });
                        });
                    });
                }).catch((error) => {
                    res.status(500).send({
                        operation: 'Opening port',
                        failure: error.message
                    });
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

/**
 * Endpoint for opening a given port
 * @param portName name of the port
 * @returns success response if operation completed successfully, or the port is already opened
 * @returns [500] with a failure response an error occurs
 * @returns [404] if port name is undefined
 * @Note tested in postman
 */
router.post('/open', (req, res) => {
    const portName = req.body.portName;
    if (portName) {
        controller.openPort(portName).then((result) => {
            if (result) {
                res.send({
                    success: 'Port ' + portName + ' was opened successfully'
                });
            } else {
                res.send({
                    success: result
                });
            }
        }).catch((error) => {
            res.status(500).send({
                operation: 'Opening port',
                failure: error.message
            });
        });
    } else {
        res.status(404).send({
            failure: 'Port name is undefined',
        });
    }
});

/**
 * Endpoint for closing a given port
 * @param portName name of the port
 * @returns success response if operation completed successfully, or the port is already closed
 * @returns [500] with a failure response if an error occurs
 * @returns [404] if port name is undefined
 * @Note tested in postman
 */
router.post('/close', (req, res) => {
    const portName = req.body.portName;
    if (portName) {
        controller.closePort(portName).then((result) => {
            res.status(500).send({
                success: 'Port ' + portName + ' is closed',
            });
        }).catch((error) => {
            res.status(500).send({
                failure: error,
            });
        });
    } else {
        res.status(404).send({
            failure: 'Port name is undefined',
        });
    }
});
//TODO: create write to port api endpoint

module.exports = router;