const express = require("express");
const path = require("path");

const fileHandlerPath = path.join("..", "..", "files_handler", "files.js");
const filesHandler = require(fileHandlerPath);

const controllerPath = path.join("..", "controller");
const controller = require(controllerPath);

const router = express.Router();

/**
 * Endpoint for connected ports list in the server
 * @returns success message, connected ports count and list in response if operation executed successfully
 * @returns [500] with a failure response if an error occurs
 * @note tested in postman
 */
router.get("/", (req, res) => {
    controller
        .portsList()
        .then(result => {
            res.send({
                success: "Operation completed successfully",
                count: result.count,
                ports: result.obj
            });
        })
        .catch(error => {
            res.status(500).send({
                failure: error
            });
        });
});

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
router.post("/draw", (req, res) => {
    const {
        portName,
        fileName
    } = req.body;
    if (portName) {
        if (fileName) {
            controller
                .openPort(portName)
                .then(result => {
                    controller
                        .initializeDelimiterParser(portName)
                        .then(result => {
                            controller
                                .registerOnDataEvent(portName)
                                .then(() => {
                                    filesHandler
                                        .addOutputDirectory("" + Date.now())
                                        .then(dirPath => {
                                            filesHandler
                                                .getGcodeFile(fileName)
                                                .then(filePath => {
                                                    controller
                                                        .readGcodeFileLines(dirPath, filePath, fileName, true)
                                                        .then(result => {
                                                            const t = Date.now();
                                                            filesHandler.logMessage(
                                                                dirPath,
                                                                t,
                                                                "Starting Gcode Transmission "
                                                            );
                                                            filesHandler.logMessage(
                                                                dirPath,
                                                                t,
                                                                "file: " + filePath
                                                            );
                                                            controller.startSendingProcess(
                                                                portName,
                                                                dirPath,
                                                                t
                                                            );
                                                            res.send({
                                                                success: "GCode transmission has started successfully"
                                                            });
                                                        })
                                                        .catch(error => {
                                                            const preError = error;
                                                            controller
                                                                .closePort(portName)
                                                                .then(result => {
                                                                    res.status(500).send({
                                                                        operation: "Reading file lines",
                                                                        failure: preError,
                                                                        isPortClosed: true
                                                                    });
                                                                })
                                                                .catch(error => {
                                                                    controller.closePort(portName).then(result => {
                                                                        res.status(500).send({
                                                                            operation: "Reading file lines",
                                                                            failure: preError,
                                                                            isPortClosed: false
                                                                        });
                                                                    });
                                                                });
                                                        });

                                                }).catch(error => {
                                                    const preError = error;
                                                    controller
                                                        .closePort(portName)
                                                        .then(result => {
                                                            res.status(500).send({
                                                                operation: "Getting gcode file",
                                                                failure: preError,
                                                                isPortClosed: true
                                                            });
                                                        })
                                                        .catch(error => {
                                                            res.status(500).send({
                                                                operation: "Getting gcode file",
                                                                failure: preError,
                                                                isPortClosed: false
                                                            });
                                                        });
                                                });
                                        }).catch(error => {
                                            // console.log('addOutputDirectory error :', error);
                                            const preError = error;
                                            controller
                                                .closePort(portName)
                                                .then(result => {
                                                    res.status(500).send({
                                                        operation: "Creating output directory",
                                                        failure: preError,
                                                        isPortClosed: true
                                                    });
                                                })
                                                .catch(error => {
                                                    // console.log('closePort in addOutputDirectory catch, error :', error);
                                                    res.status(500).send({
                                                        operation: "Creating output directory",
                                                        failure: preError,
                                                        isPortClosed: false
                                                    });
                                                });
                                        });
                                }).catch(error => {
                                    const preError = error;
                                    controller
                                        .closePort(portName)
                                        .then(result => {
                                            res.status(500).send({
                                                operation: "Registering on Data event for the port",
                                                failure: preError,
                                                isPortClosed: true
                                            });
                                        })
                                        .catch(error => {
                                            res.status(500).send({
                                                operation: "Initializing delimiter parser for port",
                                                failure: preError,
                                                isPortClosed: false
                                            });
                                        });
                                });
                        }).catch(error => {
                            const preError = error;
                            controller
                                .closePort()
                                .then(result => {
                                    res.status(500).send({
                                        operation: "Initializing delimiter parser for port",
                                        failure: preError,
                                        isPortClosed: true
                                    });
                                })
                                .catch(error => {
                                    res.status(500).send({
                                        operation: "Initializing delimiter parser for port",
                                        failure: preError,
                                        isPortClosed: false
                                    });
                                });
                        });
                }).catch(error => {
                    res.status(500).send({
                        operation: "Opening port",
                        failure: error.message
                    });
                });
        } else {
            res.status(404).send({
                failure: "Gcode file name is undefined"
            });
        }
    } else {
        res.status(404).send({
            failure: "Port name is undefined"
        });
    }
});

/**
 * Endpoint for opening a given port, it will initialize a parser and register on Data event for port and close the port
 * if an error occurs while executing the two last operations
 * @param portName name of the port
 * @returns success response if operation completed successfully, or the port is already opened
 * @returns [500] with a failure response an error occurs
 * @returns [404] if port name is undefined
 * @Note tested in postman
 * TODO: add auth middleware
 */
router.post("/open", (req, res) => {
    const portName = req.body.portName;
    if (portName) {
        controller
            .openPort(portName)
            .then(result => {
                if (result === true) {
                    controller
                        .initializeDelimiterParser(portName)
                        .then(result => {
                            console.log("initializeDelimiterParser is done");
                            controller
                                .registerOnDataEvent(portName)
                                .then(() => {
                                    console.log("registerOnDataEvent is done");
                                    res.send({
                                        success: "Port " + portName + " was opened successfully"
                                    });
                                })
                                .catch(error => {
                                    console.log("error in registerOnDataEvent");
                                    const preError = error;
                                    controller
                                        .closePort(portName)
                                        .then(result => {
                                            res.status(500).send({
                                                operation: "Registering on Data event for the port" + portName,
                                                failure: preError,
                                                isPortClosed: true
                                            });
                                        })
                                        .catch(error => {
                                            res.status(500).send({
                                                operation: "Initializing delimiter parser for port" + portName,
                                                failure: preError,
                                                isPortClosed: false
                                            });
                                        });
                                });
                        })
                        .catch(error => {
                            console.log("error in initializeDelimiterParser");
                            const preError = error;
                            controller
                                .closePort()
                                .then(result => {
                                    res.status(500).send({
                                        operation: "Initializing delimiter parser for port" + portName,
                                        failure: preError,
                                        isPortClosed: true
                                    });
                                })
                                .catch(error => {
                                    res.status(500).send({
                                        operation: "Initializing delimiter parser for port" + portName,
                                        failure: preError,
                                        isPortClosed: false
                                    });
                                });
                        });
                } else {
                    res.send({
                        success: "Port: " + portName + " is already opened"
                    });
                }
            })
            .catch(error => {
                // console.log("outer catch");
                // console.log('error :', error);
                res.status(500).send({
                    operation: "Opening port",
                    failure: error.message
                });
            });
    } else {
        res.status(404).send({
            failure: "Port name is undefined"
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
 * TODO: add auth middleware
 */
router.post("/close", (req, res) => {
    const portName = req.body.portName;
    if (portName) {
        controller
            .closePort(portName)
            .then(result => {
                res.status(500).send({
                    success: "Port " + portName + " is closed"
                });
            })
            .catch(error => {
                res.status(500).send({
                    failure: error
                });
            });
    } else {
        res.status(404).send({
            failure: "Port name is undefined"
        });
    }
});

/**
 * Endpoint for writing data into a given port
 * @param portName name of the port
 * @param data string value to be sent to port
 * @returns success response if operation completed successfully
 * @returns [500] with a failure response if an error occurs, or the operation resolved with false!
 * @returns [404] if one of the params is undefined
 * @Note tested in postman
 * TODO: add auth middleware
 */
router.post("/write", (req, res) => {
    const {
        portName,
        data
    } = req.body;
    if (portName) {
        if (data) {
            controller
                .writeDataToPort(portName, data)
                .then(result => {
                    if (result) {
                        res.send({
                            success: "Data has been written successfully"
                        });
                    } else {
                        res.status(500).send({
                            failure: "Something went wrong while writing data to port " + portName
                        });
                    }
                })
                .catch(error => {
                    res.status(500).send({
                        failure: error
                    });
                });
        } else {
            res.status(404).send({
                failure: "Data to be written is undefined"
            });
        }
    } else {
        res.status(404).send({
            failure: "Port name is undefined"
        });
    }
});

module.exports = router;