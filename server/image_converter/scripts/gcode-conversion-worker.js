const img2gcode = require("img2gcode");
const {
    isMainThread,
    parentPort,
    workerData
} = require('worker_threads');

if (!isMainThread) {
    const imagePath = workerData.imagePath;
    const parameters = JSON.parse(workerData.params);
    // console.log('parameters :', parameters);
    img2gcode.start({
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
        })
        .on("log", str => {
            parentPort.postMessage({
                state: 'log',
                'data': str
            });
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
        })
        .then((data) => {
            parentPort.postMessage({
                state: 'completed',
                data
            });
        });
}