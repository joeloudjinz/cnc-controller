const img2gcode = require('img2gcode');
const root_path = require('app-root-path').path;
const path = require('path');

let results = false;

/**
 * ? This module exports functionalities about image conversion to be used in the app
 * @functions 2
 * @objects none
 */
module.exports = {
    /**
     * ? convert an image into gcode with default parameters
     * @param image: name and ext of the image
     * @param height: image height
     * @event log: Displays information about the conversion at the start
     * @event tick: Percentage of black pixels processed. 0 (0%) to 1 (100%)
     * @event error: displays the error 
     * @event complete: called at the completion of the process, used to send data about the conversion to the api call
     */
    defaultImageConversion: (imagePath, params) => {
        const parameters = JSON.parse(params);
        return new Promise(async (resolve, reject) => {
            await img2gcode
                .start({ // It is mm
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
                .on('log', (str) => {
                    console.log(str);
                })
                .on('error', (err) => {
                    reject(err);
                })
                .on('complete', (data) => {
                    resolve(data);
                });
        });
    },
    /**
     * TODO: create a function that stores the conversion process details 
     */
    storeConversionDetails() {
        return new Promise((resolve, reject) => {

        });
    }
}