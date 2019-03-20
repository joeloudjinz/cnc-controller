//TODO: prepare work space
const express = require('express');
const path = require('path');

const fileHandlerPath = path.join('..', '..', 'files_handler', 'files.js');
const filesHandler = require(fileHandlerPath);

const controllerPath = path.join('..', 'controller');
const controller = require(controllerPath);

const fileName = "sm-sample";
const portName = '/dev/ttyACM0';

// filesHandler.addOutputDirectory("" + Date.now()).then((dirPath) => {
//     filesHandler.getGcodeFile(fileName).then((filePath) => {
//         controller.readGcodeFileLines(dirPath, filePath, fileName).then((result) => {
//             console.log('result :', result);
//         }).catch((error) => {
//             console.log(error);
//         });
//     }).catch((error) => {
//         console.log(error);
//     });
// }).catch((error) => {
//     console.log(error);
// });


//* testing writeDataAndDrain
// setTimeout(() => {
//     controller.writeDataAndDrain(portName, 'G01 X8.5008 Y-218.1008 Z-0.4015\r').then((result) => {
//         console.log('writeDataToPort result :', result);

//     }).catch((err) => {
//         console.log(err);
//     });
// }, 2000);

const router = express.Router();

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
                    }).catch((error) => {
                        console.log(error);
                    });
                }).catch((error) => {
                    console.log(error);
                });
            }).catch((error) => {
                console.log(error);
            });
        }).catch((error) => {
            console.log(error);
        });
    }).catch((error) => {
        console.log(error);
    });
}).catch((error) => {
    console.log(error);
});

//TODO: create full draw api endpoint

//TODO: create open port api endpoint
//TODO: create close port api endpoint
//TODO: create write to port api endpoint

module.exports = router;