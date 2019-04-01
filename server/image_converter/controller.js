const img2gcode = require("img2gcode");
const root_path = require("app-root-path").path;
const path = require("path");

const dbConfigPath = path.join("..", "config", "database");
const database = require(dbConfigPath);
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
    // console.log(params);
    const parameters = JSON.parse(params);
    // console.log(parameters);
    return new Promise(async (resolve, reject) => {
      await img2gcode
        .start({
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
          console.log(str);
        })
        .on("tick", prec => {
          console.log(prec);
        })
        .on("error", err => {
          reject(err);
        })
        .on("complete", data => {
          resolve(data);
        })
        .then((data) => {
          console.log(data);
        });
    });
  },
  /**
   * Store the details of the conversion of an image
   * @param data: JSON object holds all the parameters of the conversion process, the image and gcode file names
   */
  storeConversionDetails(data) {
    //? 14 attributes
    const query =
      "INSERT INTO conversions " +
      "(`image`,`gcode`,`too_diameter`,`sensitivity`,`scale_axes`,`deep_step`," +
      "`white_z`,`black_z`,`safe_z`,`feed_rate`,`time`,`error_per`,`image_size`) " +
      "VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)";
    // console.log("Data in storeConversionDetails => " + data);
    return new Promise((resolve, reject) => {
      try {
        database.getConnection().query(query,
          [
            data.image, data.gcode, data.toolDiameter, data.sensitivity, data.scaleAxes,
            data.deepStep, data.whiteZ, data.blackZ, data.safeZ, JSON.stringify(data.feedrate), data.time,
            data.errBlackPixel, data.imgSize
          ], (error, results, fields) => {
            if (error) {
              console.log(error);
              reject(error);
            } else {
              resolve(results);
            }
          });
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  },
  getConversionsCount: () => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT COUNT(id) AS count FROM conversions WHERE is_deleted=0';
      database.getConnection().query(query, [], (error, results, fields) => {
        if (error) {
          reject(error);
        } else {
          resolve(results[0].count);
        }
      });
    });
  }
};