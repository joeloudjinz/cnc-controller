const img2gcode = require("img2gcode");
const {
    isMainThread,
    parentPort,
    workerData
} = require('worker_threads');

if (!isMainThread) {
    const imagePath = workerData.imagePath;
    const parameters = JSON.parse(workerData.params);
    // TODO: extract laser mode data from worker data
    const {
        laserModeStatus,
        powerOff,
        powerOn
    } = workerData.laserConfig;
    // TODO: prepare conversion params here before using them in start, use laserModeStatus to set them properly 
    let configuration;
    if (laserModeStatus === true || laserModeStatus === 'true') {
        configuration = {
            // It is mm
            toolDiameter: parameters.toolDiameter || 1,
            sensitivity: parameters.sensitivity || 0.95,
            scaleAxes: parseInt(parameters.scaleAxes),
            deepStep: parseInt(parameters.deepStep) || -1,
            laser: {
                commandPowerOn: powerOn || "M04",
                commandPowerOff: powerOff || "M05"
            },
            feedrate: {
                work: parseInt(parameters.work) || 1200,
                idle: parseInt(parameters.idle) || 3000
            },
            whiteZ: parseInt(parameters.whiteZ) || 0,
            blackZ: parseInt(parameters.blackZ) || -2,
            safeZ: parseInt(parameters.safeZ) || 1,
            info: "emitter", // "none" or "console" or "emitter"
            dirImg: imagePath
        }
    } else {
        configuration = {
            // It is mm
            toolDiameter: parameters.toolDiameter || 1,
            sensitivity: parameters.sensitivity || 0.95,
            scaleAxes: parseInt(parameters.scaleAxes),
            deepStep: parseInt(parameters.deepStep) || -1,
            feedrate: {
                work: parseInt(parameters.work) || 1200,
                idle: parseInt(parameters.idle) || 3000
            },
            whiteZ: parseInt(parameters.whiteZ) || 0,
            blackZ: parseInt(parameters.blackZ) || -2,
            safeZ: parseInt(parameters.safeZ) || 1,
            info: "emitter", // "none" or "console" or "emitter"
            dirImg: imagePath
        }
    }
    // console.log('configuration :', configuration);
    img2gcode.start(configuration)
        .on("log", str => {
            if (str === '-> Openping and reading...') {
                parentPort.postMessage({
                    state: 'start',
                    'data': 'Image conversion has started'
                });
            } else {
                parentPort.postMessage({
                    state: 'log',
                    'data': str
                });
            }
        })
        .on("error", error => {
            console.log(error);
            // parentPort.postMessage({
            //     state: 'error',
            //     'data': error
            // });
        })
        .on("complete", data => {
            parentPort.postMessage({
                state: 'completed',
                data
            });
        });
    // .then((data) => {
    //     parentPort.postMessage({
    //         state: 'completed',
    //         data
    //     });
    // });
}