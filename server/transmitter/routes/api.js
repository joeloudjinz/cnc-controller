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
 * @param portName the name of the port
 */
initializeLogFileForTransmissionProcess = (dirPath, filePath, fileName, portName) => {
    filesHandler.logMessage(dirPath, fileName, "Starting Gcode Transmission", true, portName, "onLog");
    filesHandler.logMessage(dirPath, fileName, "file: " + filePath, true, portName, "onLog");
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
                ports: result.obj,
                isServerActive: result.isActive
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
 * @returns success response if operation started, with the estimated time to end the process
 * @returns [500] with a failure response if one operation didn't executed successfully and closes the port if opned
 * @returns [404] if one of the params is undefined, along with a failure message
 * TODO: store transmission data into transmission table
 * TODO: add auth middleware
 * TODO: add registerOnCloseEvent operation for the port
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
                                                                initializeLogFileForTransmissionProcess(dirPath, filePath, currentTS, portName);
                                                                controller.startSendingProcess(portName, dirPath, currentTS, true);
                                                                res.send({
                                                                    success: "GCode transmission has started successfully",
                                                                    estimated: controller.getEstimatedTimeToSendCode()
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
                                                initializeLogFileForTransmissionProcess(dirPath, filePath, currentTS, portName);
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
                //? true means if the port is opened by the call of operation openPort()
                if (result === true) {
                    controller
                        .initializeDelimiterParser(portName)
                        .then(result => {
                            controller
                                .registerOnDataEventForSinglePort(portName)
                                .then(() => {
                                    controller
                                        .registerOnCloseEvent(portName)
                                        .then((result) => {
                                            res.send({
                                                success: 'Port ' + portName + ' was opened successfully'
                                            });
                                        }).catch((error) => {
                                            const preError = error;
                                            controller
                                                .closePort(portName)
                                                .then(result => {
                                                    res.status(500).send(errorObject("Registering on Close event for the port", preError, true));
                                                })
                                                .catch(error => {
                                                    res.status(500).send(errorObject("Registering on Close event for the port", preError, false));
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
                    res.send({
                        success: "Port: " + portName + " is already opened"
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
                res.send({
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

/**
 * Endpoint for flushing data of a given port
 * @param portName name of the port
 * @returns success response if operation completed successfully
 * @returns [500] with a failure response if an error occurs.
 * @returns [404] if port name is undefined
 * TODO: add auth middleware
 */
router.post('/flush', (req, res) => {
    const portName = req.body.portName;
    if (portName) {
        controller
            .flushSerialPort(portName)
            .then((result) => {
                if (result) {
                    res.send({
                        success: 'Data on port ' + portName + ' flushed successfully'
                    });
                } else {
                    res.status(500).send({
                        failure: 'Something is wrong!',
                        result
                    });
                    console.log('result in /flush is :', result);
                }
            }).catch((error) => {
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
 * Endpoint to resume emitting data of a given port
 * @param portName name of the port
 * @returns success response if operation completed successfully
 * @returns [500] with a failure response if an error occurs.
 * @returns [404] if port name is undefined
 * TODO: add auth middleware
 */
router.post('/resume', (req, res) => {
    const portName = req.body.portName;
    if (portName) {
        controller
            .resumeEmittingDataEvent(portName)
            .then((result) => {
                if (result) {
                    res.send({
                        success: 'Emitting data on port ' + portName + ' is resumed'
                    });
                } else {
                    res.status(500).send({
                        failure: 'Something is wrong!',
                        result
                    });
                    console.log('result in /resume is :', result);
                }
            }).catch((error) => {
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
 * Endpoint to pause emitting data of a given port
 * @param portName name of the port
 * @returns success response if operation completed successfully
 * @returns [500] with a failure response if an error occurs.
 * @returns [404] if port name is undefined
 * TODO: add auth middleware
 */
router.post('/pause', (req, res) => {
    const portName = req.body.portName;
    if (portName) {
        controller
            .pauseEmittingDataEvent(portName)
            .then((result) => {
                if (result) {
                    res.send({
                        success: 'Emitting data on port ' + portName + ' is paused successfully'
                    });
                } else {
                    res.status(500).send({
                        failure: 'Something is wrong!',
                        result
                    });
                    console.log('result in /pause is :', result);
                }
            }).catch((error) => {
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
 * Endpoint to pause current gcode transmission process
 * @param portName name of the port
 * @returns success response if operation completed successfully
 * @returns [500] with a failure response if an error occurs.
 * @returns [404] if port name is undefined
 * TODO: add auth middleware
 */
router.post('/draw/pause', (req, res) => {
    const portName = req.body.portName;
    if (portName) {
        controller
            .pauseSendingProcess(portName)
            .then((result) => {
                if (result) {
                    res.send({
                        success: 'GCode lines send process to port: ' + portName + ' is paused'
                    });
                } else {
                    res.status(500).send({
                        failure: 'Something is wrong!',
                        result
                    });
                    console.log('result in /draw/pause is :', result);
                }
            }).catch((error) => {
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
 * Endpoint to resume current gcode transmission process
 * @param portName name of the port
 * @returns success response if operation completed successfully
 * @returns [500] with a failure response if an error occurs.
 * @returns [404] if port name is undefined
 * TODO: add auth middleware
 */
router.post('/draw/resume', (req, res) => {
    const portName = req.body.portName;
    if (portName) {
        controller
            .resumeSendingProcess(portName)
            .then((result) => {
                if (result) {
                    res.send({
                        success: 'GCode lines send process to port: ' + portName + ' is resumed'
                    });
                } else {
                    res.status(500).send({
                        failure: 'Something is wrong!',
                        result
                    });
                    console.log('result in /draw/resume is :', result);
                }
            }).catch((error) => {
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
 * Endpoint to stop current gcode transmission process
 * @param portName name of the port
 * @returns success response if operation completed successfully
 * @returns [500] with a failure response if an error occurs.
 * @returns [404] if port name is undefined
 * TODO: add auth middleware
 */
router.post('/draw/stop', (req, res) => {
    const portName = req.body.portName;
    if (portName) {
        controller
            .stopSendingProcess(portName)
            .then((result) => {
                if (result) {
                    res.send({
                        success: 'GCode lines send process to port: ' + portName + ' is stopped'
                    });
                } else {
                    res.status(500).send({
                        failure: 'Something is wrong!',
                        result
                    });
                    console.log('result in /draw/stop is :', result);
                }
            }).catch((error) => {
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
 * Endpoint to know if there is a transmission process active
 * @returns success response if operation completed successfully
 * TODO: add auth middleware
 */
router.get('/draw/isActive', (req, res) => {
    const bool = controller.isActive();
    res.send({
        success: 'Operation completed successfully',
        status: bool
    });
});
/**
 * Endpoint to know if a port is opened or not.
 * @param portName name of the port
 * @returns success response if operation completed successfully
 * @returns [500] with a failure response if an error occurs.
 * @returns [404] if port name is undefined
 * TODO: add auth middleware
 */
router.get('/isOpen', (req, res) => {
    const portName = req.query.portName;
    // console.log('req.query :', req.query);
    // console.log('portName :', portName);
    if (portName) {
        controller
            .isPortOpen(portName)
            .then((isOpen) => {
                res.send({
                    success: 'Operation completed successfully',
                    isOpen
                });
            }).catch((error) => {
                // console.log("error: " + error);
                res.status(500).send({
                    failure: 'There was a problem executing the operation!',
                    error
                });
            });
    } else {
        res.status(404).send({
            failure: "Port name is undefined"
        });
    }
});
/**
 * Endpoint to know if a given port is active in a transmission process 
 * @param portName name of the port
 * @returns success response if operation completed successfully
 * @returns [500] with a failure response if an error occurs.
 * @returns [404] if port name is undefined
 * TODO: add auth middleware
 */
router.get('/isActive', (req, res) => {
    const portName = req.query.portName;
    if (portName) {
        controller
            .isPortActive(portName)
            .then((isPortActive) => {
                res.send({
                    success: 'Operation completed successfully',
                    status: isPortActive
                });
            }).catch((error) => {
                res.status(500).send({
                    failure: 'There was a problem executing the operation!',
                    error
                });
            });
    } else {
        res.status(404).send({
            failure: "Port name is undefined"
        });
    }

});

module.exports = router;