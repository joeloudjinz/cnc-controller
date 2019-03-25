const express = require("express");
const path = require("path");

const fileHandlerPath = path.join("..", "..", "files_handler", "files.js");
const filesHandler = require(fileHandlerPath);

const controllerPath = path.join("..", "controller");
const controller = require(controllerPath);

const router = express.Router();

/**
 * Used by /draw endpoint to initialize a .log file with the first two lines.
 * @param dirPath subdirectory in output directory that holds the files the current transmission output files
 * @param filePath gcode file path
 * @param fileName the name of .log file, it's the current timestamp
 */
initializeLogFileForTransmissionProcess = (dirPath, filePath, fileName) => {
    filesHandler.logMessage(dirPath, fileName, "Starting Gcode Transmission ");
    filesHandler.logMessage(dirPath, fileName, "file: " + filePath);
};

/**
 * Used by /draw endpoint to construct the returned object by res.send().
 * @param operation name of the current operation
 * @param failure the message of failure, the error message
 * @param isPortClosed the status of closePort operation, either true if closed, or otherwise
 */
errorObject = (operation, failure, isPortClosed) => {
    return {
        operation,
        failure,
        isPortClosed
    };
};

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
 * Endpoint for full draw operation, including opening a given port and registering onData event along with initializing a parser,
 * creating output directory and logging file, and at last, launching gcode send process.
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
            const currentTS = "" + Date.now();
            controller
                .openPort(portName)
                .then(result => {
                    //? true means if the port is opened by the call of operation openPort()
                    if (result === true) {
                        controller
                            .initializeDelimiterParser(portName)
                            .then(result => {
                                controller
                                    .registerOnDataEvent(portName)
                                    .then(() => {
                                        filesHandler
                                            .addOutputDirectory(currentTS)
                                            .then(dirPath => {
                                                filesHandler
                                                    .getGcodeFile(fileName)
                                                    .then(filePath => {
                                                        controller
                                                            .readGcodeFileLines(dirPath, filePath, fileName)
                                                            .then(result => {
                                                                initializeLogFileForTransmissionProcess(dirPath, filePath, currentTS);
                                                                controller.startSendingProcess(portName, dirPath, currentTS, true);
                                                                res.send({
                                                                    success: "GCode transmission has started successfully"
                                                                });
                                                            })
                                                            .catch(error => {
                                                                const preError = error;
                                                                controller
                                                                    .closePort(portName)
                                                                    .then(result => {
                                                                        res.status(500).send(errorObject("Reading file lines", preError, true));
                                                                    })
                                                                    .catch(error => {
                                                                        controller.closePort(portName).then(result => {
                                                                            res.status(500).send(errorObject("Reading file lines", preError, false));
                                                                        });
                                                                    });
                                                            });
                                                    }).catch(error => {
                                                        const preError = error;
                                                        controller
                                                            .closePort(portName)
                                                            .then(result => {
                                                                res.status(500).send(errorObject("Getting gcode file", preError, true));
                                                            })
                                                            .catch(error => {
                                                                res.status(500).send(errorObject("Getting gcode file", preError, false));
                                                            });
                                                    });
                                            }).catch(error => {
                                                const preError = error;
                                                controller
                                                    .closePort(portName)
                                                    .then(result => {
                                                        res.status(500).send(errorObject("Creating output directory", preError, true));
                                                    })
                                                    .catch(error => {
                                                        res.status(500).send(errorObject("Creating output directory", preError, false));
                                                    });
                                            });
                                    }).catch(error => {
                                        const preError = error;
                                        controller
                                            .closePort(portName)
                                            .then(result => {
                                                res.status(500).send(errorObject("Registering on Data event for the port", preError, true));
                                            })
                                            .catch(error => {
                                                res.status(500).send(errorObject("Registering on Data event for the port", preError, false));
                                            });
                                    });
                            }).catch(error => {
                                const preError = error;
                                controller
                                    .closePort()
                                    .then(result => {
                                        res.status(500).send(errorObject("Initializing delimiter parser for port", preError, true));
                                    })
                                    .catch(error => {
                                        res.status(500).send(errorObject("Initializing delimiter parser for port", preError, false));
                                    });
                            });
                    } else {
                        //? false, means the port was already opened previously 
                        filesHandler
                            .addOutputDirectory(currentTS)
                            .then(dirPath => {
                                filesHandler
                                    .getGcodeFile(fileName)
                                    .then(filePath => {
                                        controller
                                            .readGcodeFileLines(dirPath, filePath, fileName)
                                            .then(result => {
                                                initializeLogFileForTransmissionProcess(dirPath, filePath, currentTS);
                                                controller.startSendingProcess(portName, dirPath, currentTS, true);
                                                res.send({
                                                    success: "GCode transmission has started successfully"
                                                });
                                            })
                                            .catch(error => {
                                                const preError = error;
                                                controller
                                                    .closePort(portName)
                                                    .then(result => {
                                                        res.status(500).send(errorObject("Reading file lines", preError, true));
                                                    })
                                                    .catch(error => {
                                                        controller.closePort(portName).then(result => {
                                                            res.status(500).send(errorObject("Reading file lines", preError, false));
                                                        });
                                                    });
                                            });

                                    }).catch(error => {
                                        const preError = error;
                                        controller
                                            .closePort(portName)
                                            .then(result => {
                                                res.status(500).send(errorObject("Getting gcode file", preError, true));
                                            })
                                            .catch(error => {
                                                res.status(500).send(errorObject("Getting gcode file", preError, false));
                                            });
                                    });
                            }).catch(error => {
                                const preError = error;
                                controller
                                    .closePort(portName)
                                    .then(result => {
                                        res.status(500).send(errorObject("Creating output directory", preError, true));
                                    })
                                    .catch(error => {
                                        res.status(500).send(errorObject("Creating output directory", preError, false));
                                    });
                            });
                    }
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