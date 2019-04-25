const img2gcode = require("img2gcode");
const path = require("path");
const {
  Worker
} = require('worker_threads');

const dbConfigPath = path.join("..", "config", "database");
const database = require(dbConfigPath);

const fileHandlerPath = path.join('..', 'files_handler', 'files');
const filesHandler = require(fileHandlerPath);

const socketManagerPath = path.join("..", "socket_manager", "controller.js");
const socketManager = require(socketManagerPath);

const workerPath = path.join(__dirname, 'scripts', 'gcode-conversion-worker.js');
// const conversionWorker = require(workerPath);
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
  // defaultImageConversion: (imagePath, params) => {
  //   // console.log(params);
  //   const parameters = JSON.parse(params);
  //   // console.log(parameters);
  //   return new Promise(async (resolve, reject) => {
  //     await img2gcode
  //       .start({
  //         // It is mm
  //         toolDiameter: parameters.toolDiameter || 1,
  //         sensitivity: parameters.sensitivity || 0.95,
  //         scaleAxes: parseInt(parameters.scaleAxes),
  //         deepStep: parseInt(parameters.deepStep) || -1,
  //         feedrate: {
  //           work: parseInt(parameters.work) || 1200,
  //           idle: parseInt(parameters.idle) || 3000
  //         },
  //         whiteZ: parseInt(parameters.whiteZ) || 0,
  //         blackZ: parseInt(parameters.blackZ) || -2,
  //         safeZ: parseInt(parameters.safeZ) || 1,
  //         info: "emitter", // "none" or "console" or "emitter"
  //         dirImg: imagePath
  //       })
  //       .on("log", str => {
  //         console.log(str);
  //       })
  //       // .on("tick", prec => {
  //       //   console.log(prec);
  //       // })
  //       .on("error", err => {
  //         reject(err);
  //       })
  //       .on("complete", data => {
  //         resolve(data);
  //       })
  //       .then((data) => {
  //         console.log(data);
  //       });
  //   });
  // },
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
  },

  // workOnConvertImage1: (imagePath, params) => {
  //   return new Promise((resolve, reject) => {
  //     try {
  //       const worker = new Worker(workerPath, {
  //         workerData: {
  //           imagePath,
  //           params
  //         }
  //       });
  //       worker.on('message', (message) => {
  //         if (message.state === 'completed') {
  //           resolve(message.data);
  //         } else if (message.state === 'error') {
  //           reject(message.data);
  //         } else if (message.state === 'start') {
  //           informConversionHasStarted();
  //         } else {
  //           console.log("Message from the converter", message.data);
  //         }
  //       });

  //       worker.on('error', (error) => reject(error));
  //       worker.on('exit', (code) => {
  //         if (code !== 0)
  //           reject(new Error(`Conversion Worker stopped with exit code ${code}`));
  //       });
  //     } catch (error) {
  //       console.log("while launching worker:", error);
  //     }
  //   });
  // },
  /**
   * move the conversion process from the main thread 
   * @param imagePath the path to the image
   * @param params conversion parameters
   * @param fileObject the object from form data of the uploaded image 
   */
  workOnConvertImage: (imagePath, params, fileObject) => {
    try {
      const worker = new Worker(workerPath, {
        workerData: {
          imagePath,
          params
        }
      });
      worker.on('message', (message) => {
        if (message.state === 'completed') {
          handleConversionEndProcess(message.data, fileObject);
        } else if (message.state === 'error') {
          handleConversionErrorOccur(message.data);
        } else {
          console.log("Message from the converter", message.data);
        }
      });
      worker.on('error', (error) => {
        handleConversionErrorOccur(error);
      });
      worker.on('exit', (code) => {
        if (code !== 0) {
          handleConversionErrorOccur(`Conversion Worker stopped with exit code ${code}`);
        }
      });
    } catch (error) {
      handleConversionErrorOccur(`Internal error occurred! ${error}`);
      console.log("while launching worker:", error);
    }
  }
};
/**
 * Perform the rest of the operation when the conversion process has to the end
 * @param data the data return from img2gcode.start() function
 */
handleConversionEndProcess = (data, fileObject) => {
  results = data;
  const splitted = fileObject.filename.split(".");
  const fileName = splitted[0] + "." + splitted[1] + ".gcode";
  filesHandler.moveDotGcode(data.dirgcode, fileName)
    .then((result) => {
      if (result) {
        const tt = new Date(Date.now());
        const endTime = `${tt.getHours()}:${tt.getMinutes()}:${tt.getSeconds()}`;
        const {
          toolDiameter,
          sensitivity,
          scaleAxes,
          deepStep,
          whiteZ,
          blackZ,
          safeZ,
          feedrate,
          errBlackPixel,
          time,
          imgSize
        } = results.config;
        const t = new Date(time);
        const startTime = `${t.getHours()}:${t.getMinutes()}:${t.getSeconds()}`;
        module.exports.storeConversionDetails({
          image: fileObject.filename,
          gcode: fileName,
          toolDiameter,
          sensitivity,
          scaleAxes,
          deepStep,
          whiteZ,
          blackZ,
          safeZ,
          feedrate,
          time,
          errBlackPixel,
          imgSize
        }).then((result) => {
          filesHandler.getGCodeFileStats(fileName)
            .then((result) => {
              let size = result.size;
              socketManager.emitConversionEnded({
                toolDiameter,
                sensitivity,
                scaleAxes,
                deepStep,
                whiteZ,
                blackZ,
                safeZ,
                feedrate,
                errBlackPixel,
                imgSize,
                startTime,
                endTime,
                elapsedTime: (tt - t) * 0.001,
                fileName: fileName,
                size: size
              });
            }).catch((error) => {
              console.log("while getting states", error);
            });
        }).catch((error) => {
          console.log("while storing data", error);
          filesHandler.deleteImageFileSync(fileObject.filename);
          filesHandler.deleteGCodeFileSync(fileName);
        });
      } else {
        //? the file does not exist !!
        console.log('the file does not exist');
      }
    }).catch((error) => {
      handleConversionErrorOccur("Gcode file is generated but the process didn't end well, file name: " + fileName);
      console.log("while moving gcode file from 'images'", error);
    });
};
/**
 * Handle the  errors that occurs during conversion process.
 * will inform the client with the error 
 * @param errorData error details
 */
handleConversionErrorOccur = (errorData) => {
  socketManager.emitConversionErrorOccur({
    errorData
  });
};

constructReturnObject = (data, isError) => {
  return {
    data,
    isError
  };
};