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
     * ? The function take an image and convert it into gcode coordinates with a default configuration
     * @param imgName: name of the image
     * @param imgHeight: image height provided from the client side
     * @param imgExt: extension of the image, provided from the client side
     * @event log: Displays information about the conversion at the start
     * @event tick: Percentage of black pixels processed. 0 (0%) to 1 (100%)
     * @event error: displays the error 
     * @event complete: called at the completion of the process, used to send data about the conversion to the api call
     */
    defaultImageConversion: async (imgName, imgExt, imgHeight) => {
        let filePath = root_path + '/server/resources/images/' + imgName + imgExt;
        // console.log(filePath);
        await img2gcode
            .start({ // It is mm
                toolDiameter: 1,
                scaleAxes: parseInt(imgHeight),
                deepStep: -1,
                feedrate: {
                    work: 1200,
                    idle: 3000
                },
                whiteZ: 0,
                blackZ: -2,
                safeZ: 1,
                info: "emitter", // "none" or "console" or "emitter"
                dirImg: filePath
            })
            .on('log', (str) => {
                console.log(str);
            })
            .on('tick', (perc) => {
                console.log(perc);
            })
            .on('error', (err) => {
                // console.log(err);
                results = err;
            }).on('complete', (data) => {
                results = data;
            });
        return results;
    },
    
    /**
     * ? convert an image into gcode with default parameters
     * @param image: name and ext of the image
     * @param height: image height
     * @event log: Displays information about the conversion at the start
     * @event tick: Percentage of black pixels processed. 0 (0%) to 1 (100%)
     * @event error: displays the error 
     * @event complete: called at the completion of the process, used to send data about the conversion to the api call
     */
    defaultImageConversion: (imagePath, height) => {
        //! let filePath = root_path + '/server/resources/images/' + imagName + imgExt;
        // let filePath = path.join(root_path, 'server', 'resources', image);
        return new Promise(async (resolve, reject) => {
            await img2gcode
                .start({ // It is mm
                    toolDiameter: 1,
                    scaleAxes: parseInt(height),
                    deepStep: -1,
                    feedrate: {
                        work: 1200,
                        idle: 3000
                    },
                    whiteZ: 0,
                    blackZ: -2,
                    safeZ: 1,
                    info: "emitter", // "none" or "console" or "emitter"
                    dirImg: imagePath
                })
                .on('log', (str) => {
                    console.log(str);
                })
                .on('tick', (perc) => {
                    console.log(perc);
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

    /**
     * the function take an image and convert it into gcode coordinates inside a Promise
     * @param imgName: name of the image
     * @param imgHeight: image height provided from the client side
     * @param imgExt: extension of the image, provided from the client side
     * @event log: Displays information about the conversion at the start
     * @event tick: Percentage of black pixels processed. 0 (0%) to 1 (100%)
     * @event error: displays the error 
     * @event complete: called at the completion of the process, used to send data about the conversion to the api call
     */
    convertImagePromise: (imagNamePlusExt, imgHeight) => {
        let filePath = root_path + '/server/resources/images/' + imagNamePlusExt;
        return new Promise(async (resolve, reject) => {
            await img2gcode
                .start({ // It is mm
                    toolDiameter: 1,
                    scaleAxes: parseInt(imgHeight),
                    deepStep: -1,
                    feedrate: {
                        work: 1200,
                        idle: 3000
                    },
                    whiteZ: 0,
                    blackZ: -2,
                    safeZ: 1,
                    info: "emitter", // "none" or "console" or "emitter"
                    dirImg: filePath
                })
                .on('log', (str) => {
                    console.log(str);
                })
                .on('tick', (perc) => {
                    console.log(perc);
                })
                .on('error', (err) => {
                    reject(err);
                })
                .on('complete', (data) => {
                    resolve(data);
                });
        });
    }
}