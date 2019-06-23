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

module.exports = {
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
    return new Promise((resolve, reject) => {
      try {
        database.getConnection().query(query,
          [
            data.image, data.gcode, data.toolDiameter, data.sensitivity, data.scaleAxes,
            data.deepStep, data.whiteZ, data.blackZ, data.safeZ, JSON.stringify(data.feedrate), data.time,
            data.errBlackPixel, data.imgSize
          ], (error, results, fields) => {
            if (error) {
              // console.log(error);
              reject(error);
            } else {
              resolve(results);
            }
          });
      } catch (error) {
        // console.log(error);
        reject(error);
      }
    });
  },
  /**
   * count the number of conversion that have being made in the system
   * @resolve with the count
   * @reject with error
   */
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
  /**
   * move the conversion process from the main thread 
   * @param imagePath the path to the image
   * @param params conversion parameters
   * @param imageName the object from form data of the uploaded image 
   * @param isQuick to indicate if it's quick conversion or not
   * @param target to whom the data should be pushed to
   */
  workOnConvertImage: (imagePath, params, imageName, isQuick, target) => {
    try {
      // TODO: send laserModeStatus to worker script
      const worker = new Worker(workerPath, {
        workerData: {
          imagePath,
          params
        }
      });
      worker.on('message', (message) => {
        if (message.state === 'completed') {
          handleConversionEndProcess(message.data, imageName, isQuick, target);
        } else if (message.state === 'error') {
          handleConversionErrorOccur(message.data, isQuick, target);
        } else {
          console.log("Message from the converter", message.data);
        }
      });
      worker.on('error', (error) => {
        handleConversionErrorOccur(error, isQuick, target);
      });
      worker.on('exit', (code) => {
        if (code !== 0) {
          handleConversionErrorOccur(`Conversion Worker stopped with exit code ${code}`, isQuick, target);
        }
      });
    } catch (error) {
      handleConversionErrorOccur(`Internal error occurred! ${error}`, isQuick, target);
      console.log("while launching worker:", error);
    }
  }
};
/**
 * Perform the rest of the operation when the conversion process successfully ended
 * @param data data returned from img2gcode.start() function
 */
handleConversionEndProcess = (data, imageName, isQuick, target) => {
  results = data;
  const splitted = imageName.split(".");
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
          image: imageName,
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
              if (isQuick) {
                socketManager.emitQuickConversionEnded(errBlackPixel, target);
              } else {
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
                }, target);
              }
            }).catch((error) => {
              console.log("while getting states", error);
            });
        }).catch((error) => {
          console.log("while storing data", error);
          filesHandler.deleteImageFileSync(imageName);
          filesHandler.deleteGCodeFileSync(fileName);
        });
      } else {
        //? the file does not exist !!
        handleConversionErrorOccur("The generated Gcode file was not founded, expected file name: " + fileName, isQuick, target);
        console.log('the file does not exist');
      }
    }).catch((error) => {
      handleConversionErrorOccur("Gcode file is generated but the process didn't end well, file name: " + fileName, isQuick, target);
      console.log("while moving gcode file from 'images'", error);
    });
};
/**
 * Handle the  errors that occurs during conversion process.
 * will inform the client with the error 
 * @param errorData error details
 */
handleConversionErrorOccur = (errorData, isQuick, target) => {
  if (isQuick) {
    socketManager.emitQuickConversionErrorOccur({
      errorData
    }, target);
  } else {
    socketManager.emitConversionErrorOccur({
      errorData
    }, target);
  }
};