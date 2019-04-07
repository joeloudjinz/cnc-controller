const SerialPort = require("serialport");
//? this is used by the serial port object to use delimiter parser
const Readline = require("@serialport/parser-readline");
//? this is used by readGcodeFileLines()
const readline = require("readline");
const path = require("path");
const fs = require("fs");

const fileHandlerPath = path.join("..", "files_handler", "files.js");
const filesHandler = require(fileHandlerPath);

const socketManagerPath = path.join("..", "socket_manager", "controller.js");
const socketManager = require(socketManagerPath);

const defaultBaudRate = 115200; //! used for grbl v0.9+

//? holds all the registered ports of the server
let ports = new Map();
//? holds data parsers for each port
let parsers = new Map();

//? to know the count of the active ports
let portsCount = 0;

//! these variables for readGcodeFileLines()
//? this map holds all lines of code in a given gcode file, the key is the line number in the file
let codeLines = new Map();
//? this map holds all the comments lines
let comments = new Map();
//? this map holds characters number of each line, without counting characters of the comment in the middle of the line
let chars = new Map();
//? this variable represent the lines number in the original file, including the comments lines
let codeLinesNbr = 0;
//? the line where the send process stopped in, in the real file, not the in map object
let stoppedIn = null;
//? this variable represent the rest of the chars to be sent to the card
let restToSend = 127;
//? used to stop sending loop when there is no more room for new line characters in the serial receiver buffer
let isFull = false;
let okCount = 0;
let errorsCount = 0;

let globalLogFileName;
let globalDirName;

//? used to stop, resume or pause gcode lines transmission
let doLoop = false;

//? used to know if the status of a port is active, means there is a transmission process going on that particular port
let isActive = false;
//? used to distinct if port is active or not when tested with the value of 'isActive'
let currentPort;

//? represents the duration of the timeout to send one line of code
const lineSendDuration = 700;

//? time when draw operation started and ended
let start, end;

/**
 * Used to initialize some global variables of transmission process, by stopSendingProcess()
 * Does not initialize globalDirName and globalLogFileName
 */
initializeProcessVariables = () => {
  codeLines.clear();
  chars.clear();
  comments.clear();
  codeLinesNbr = 0;
  stoppedIn = 0;
  restToSend = 127;
  okCount = 0;
  errorsCount = 0;
  isActive = false;
  currentPort = undefined;
};

calculateProcessDuration = () => {
  const time = ((end - start) / 1000 / 60).toFixed(2);
  const splitted = time.split(".");
  let t;
  if (time < 1) {
    t = splitted[1] + " seconds";
  } else {
    t = splitted[0] + " minute & " + splitted[1] + " seconds";
  }
  return t;
};

/**
 * Used to write data after a timeout of the value of 'lineSendDuration'
 * the promise is rejected when name of the port is undefined, if there is no port name in the ports list, if the given port is closed,
 * if the data is not of type String, or when an error occurs.
 * the promise is resolved when it executes successfully with a [true] value
 * @param name the port name
 * @param data the data to be written
 */
writeData = (name, data) => {
  return new Promise((resolve, reject) => {
    if (name) {
      if (ports.has(name)) {
        if (ports.get(name).isOpen) {
          if (typeof data === "string") {
            setTimeout(() => {
              ports.get(name).write(data, error => {
                if (error) reject(error.message);
                resolve(true);
              });
            }, lineSendDuration);
          } else {
            reject("Data should be of type String");
          }
        } else {
          reject("Port " + name + " is closed!");
        }
      } else {
        reject("There is no such port named: " + name);
      }
    } else {
      reject("Name is Undefined");
    }
  });
};

/**
 * Used to write data and wait for it to be sent, after a timeout of the value of 'lineSendDuration'.
 * the promise is rejected when name of the port is undefined, if there is no port name in the ports list, if the given port is closed,
 * if the data is not of type String, or when an error occurs.
 * the promise is resolved when it executes successfully with a [true] value
 * @param name the port name
 * @param data the data to be written
 */
writeAndDrain = (name, data) => {
  return new Promise((resolve, reject) => {
    if (name) {
      if (ports.has(name)) {
        if (ports.get(name).isOpen) {
          if (typeof data === "string") {
            setTimeout(() => {
              ports.get(name).write(data);
              ports.get(name).drain(error => {
                if (error) reject(error.message);
                resolve(true);
              });
            }, lineSendDuration);
          } else {
            reject("Data should be of type String");
          }
        } else {
          reject("Port " + name + " is closed!");
        }
      } else {
        reject("There is no such port named: " + name);
      }
    } else {
      reject("Name is Undefined");
    }
  });
};

module.exports = {
  /**
   * Check for the connected devices, which means the active ports in the server every 2.5s.
   * It will push the new list to frontend.
   */
  listenToActivePorts: () => {
    setInterval(() => {
      SerialPort
        .list()
        .then(ports => {
            let obj = {};
            let count = 0;
            for (var i = 0, len = ports.length; i < len; i++) {
              if (ports[i].productId) {
                obj[i + 1] = ports[i];
                count++;
              }
            }
            if (count != portsCount) {
              console.log("Active ports list has changed, new count is: " + count + ", updating it ...");
              socketManager.emitOnPortActiveEvent(obj);
              portsCount = count;
            }
          },
          error => console.log(error.message)
        );
    }, 1500);
  },
  /**
   * Calculate the estimated time to send all lines of code in a file to the machine
   * @returns [String] the estimated time in format of seconds only or with minutes
   */
  getEstimatedTimeToSendCode: () => {
    const a = ((codeLines.size * lineSendDuration) / 1000 / 60).toFixed(2);
    const splitted = a.split(".");
    if (a < 1) {
      return splitted[1] + " seconds";
    } else {
      return splitted[0] + " minute & " + splitted[1] + " seconds";
    }
  },
  /**
   * Initialize and open a port with a name and a baud rate, the promise is rejected when 'name' is undefined,
   * or when an error occurs.
   * It will put the port object into ports map.
   * @param name of the port
   * @param baudRate the baud rate for the port
   */
  openPort: (name, baudRate) => {
    return new Promise((resolve, reject) => {
      if (name) {
        if (ports.has(name)) {
          if (ports.get(name).isOpen) {
            resolve(false);
          } else {
            ports.get(name).open(() => {
              resolve(true);
            });
          }
        } else {
          const port = new SerialPort(
            name, {
              baudRate: baudRate || defaultBaudRate
            },
            error => {
              if (error) {
                console.log(
                  "Can not open port: " + name + ", error :",
                  error.message
                );
                reject(error);
              } else {
                console.log("Port: " + name + " is opened");
                ports.set(name, port);
                resolve(true);
              }
            }
          );
        }
      } else {
        reject("Name is Undefined");
      }
    });
  },
  /**
   * Initialize a delimiter parser for a given port.
   * The promise is rejected when the port does not exist, when the port is not opened, when name of the port is undefined,
   * or when an error occurs.
   * The promise is resolved when its executed successfully with value of [true]
   * @param name of the port
   */
  initializeDelimiterParser: name => {
    return new Promise((resolve, reject) => {
      if (name) {
        if (ports.has(name)) {
          if (ports.get(name).isOpen) {
            try {
              const parser = ports.get(name).pipe(
                new Readline({
                  delimiter: "\r\n"
                })
              );
              parsers.set(name, parser);
              resolve(true);
            } catch (error) {
              reject(error.message);
            }
          } else {
            reject("Port " + name + " is closed!");
          }
        } else {
          reject("There is no such port named: " + name);
        }
      } else {
        reject("Name is Undefined");
      }
    });
  },
  /**
   * Return only connected ports list, NOT all the available ports.
   * The promise is rejected when an error occurs.
   * The promise is resolved when its executed successfully with [object] holding list of ports and the count
   * @return object with list of ports and the count.
   */
  portsList: () => {
    return new Promise((resolve, reject) => {
      SerialPort.list().then(
        ports => {
          let obj = {};
          let count = 0;
          for (var i = 0, len = ports.length; i < len; i++) {
            if (ports[i].productId) {
              obj["port" + (i + 1)] = ports[i];
              count++;
            }
          }
          resolve({
            obj,
            count,
            isActive
          });
        },
        error => reject(error.message)
      );
    });
  },
  /**
   * Closes a port and remove it from 'ports' map along with it's parser from 'parsers' map.
   * The promise is rejected when name is undefined, or there is no such port name, or when the port is already closed,
   * or when an error occurs.
   * The promise is resolved when its executed successfully with a value of [true].
   * @param name port name
   */
  closePort: name => {
    return new Promise((resolve, reject) => {
      if (name) {
        if (ports.has(name)) {
          if (ports.get(name).isOpen) {
            console.log("Closing port: " + name);
            ports.get(name).close(error => {
              if (error) {
                reject(error.message);
              } else {
                parsers.delete(name);
                ports.delete(name);
                resolve(true);
              }
            });
          } else {
            resolved("Port: " + name + " is already closed!");
          }
        } else {
          reject("There is no such port named: " + name);
        }
      } else {
        reject("Port Name is undefined");
      }
    });
  },
  /**
   * return the state of a given port, is open or closed.
   * The promise is resolved when its executed successfully with a value of the property isOpen [boolean] of serialPot instance 
   * @param name port name
   */
  isPortOpen: (name) => {
    return new Promise((resolve, reject) => {
      if (name) {
        if (ports.has(name)) {
          resolve(ports.get(name).isOpen);
        } else {
          resolve(false);
        }
      } else {
        reject("Port Name is undefined");
      }
    });
  },
  /**
   * returns the state of a given port compared with the value of iActive.
   * if the given port name is opened, matches the value of the current port and isActive is true, it will resolve with true.
   * if port is closed, it will resolve with false.
   * if current port value is undefined, it will resolve with false.
   * @returns [boolean]
   */
  isPortActive: (name) => {
    return new Promise((resolve, reject) => {
      if(currentPort){
        if (name) {
          if (ports.has(name)) {
            if (ports.get(name).isOpen) {
              //? testing if the current port name equals name argument AND isActive is true
              resolve(isActive && currentPort === name);
            } else {
              //? port is closed means it's not active
              resolved(false);
            }
          } else {
            resolve(false);
            // reject("There is no such port named: " + name);
          }
        } else {
          reject("Port Name is undefined");
        }
      }else{
        //? resolving with true if currentPort = undefined which means it wasn't assigned by any function indicating that the port is not active
        resolve(false);
      }
    });
  },
  /**
   * returns the state of the server, if it's active with some port which is receiving gcode lines from the server, or not.
   * @returns [boolean]
   */
  isActive: () => {
    return isActive;
  },
  /**
   * Register "on Data" event for a given port, will initialize a parser for the port if no parser is associated with it,
   * it will register the event after a timeout of 500ms.
   * The promise is rejected when name is undefined, or there is no such port name, or when the port is not opened.
   * The promise is resolved when its executed successfully with a value of [true].
   * @param name of the port
   * @Note don't use await, it does not work
   * @Note used by /draw endpoint
   */
  registerOnDataEvent: name => {
    return new Promise((resolve, reject) => {
      if (name) {
        if (ports.has(name)) {
          if (ports.get(name).isOpen) {
            if (parsers.has(name)) {
              setTimeout(() => {
                listenToIncomingData(name);
              }, 500);
            } else {
              initializeDelimiterParser(name)
                .then(result => {
                  setTimeout(() => {
                    listenToIncomingData(name);
                  }, 500);
                })
                .catch(error => {
                  console.log(error);
                });
            }
            resolve(true);
          } else {
            reject("Port " + name + " is closed!");
          }
        } else {
          reject("There is no such port named: " + name);
        }
      } else {
        reject("Name is Undefined");
      }
    });
  },
  /**
   * Register "on Data" event for a given port, will initialize a parser for the port if no parser is associated with it,
   * it will register the event after a timeout of 500ms.
   * The promise is rejected when name is undefined, or there is no such port name, or when the port is not opened.
   * The promise is resolved when its executed successfully with a value of [true].
   * @Note Used by /open endpoint
   */
  registerOnDataEventForSinglePort: name => {
    return new Promise((resolve, reject) => {
      if (name) {
        if (ports.has(name)) {
          if (ports.get(name).isOpen) {
            if (parsers.has(name)) {
              setTimeout(() => {
                listenToIncomingDataForSinglePort(name);
              }, 500);
            } else {
              initializeDelimiterParser(name)
                .then(result => {
                  setTimeout(() => {
                    listenToIncomingDataForSinglePort(name);
                  }, 500);
                })
                .catch(error => {
                  console.log(error);
                });
            }
            resolve(true);
          } else {
            reject("Port " + name + " is closed!");
          }
        } else {
          reject("There is no such port named: " + name);
        }
      } else {
        reject("Name is Undefined");
      }
    });
  },
  /**
   * Register "on Error" event for a given port, after a timeout of 1s.
   * The promise is rejected when name is undefined, or there is no such port name, or when the port is not opened.
   * The promise is resolved when its executed successfully with a value of [true].
   * @param name of the port
   */
  registerOnErrorEvent: name => {
    return new Promise((resolve, reject) => {
      if (name) {
        if (ports.has(name)) {
          if (ports.get(name).isOpen) {
            setTimeout(() => {
              console.log(
                "listening for errors started, port: " +
                name +
                ", open status: " +
                ports.get(name).isOpen
              );
              ports.get(name).on("error", error => {
                resolve(true);
                console.error("Error: " + error);
              });
            }, 1000);
          } else {
            reject("Port " + name + "is closed!");
          }
        } else {
          reject("There is no such port named:" + name);
        }
      } else {
        reject("Name is Undefined");
      }
    });
  },
  /**
   * Writes string data only to a given port without waiting for the serial port to be drained.
   * The promise is rejected when name is undefined, or there is no such port name,
   * or when the port is not opened, or when an error occurs.
   * @param name: port name
   * @param data: string type data to be written to port
   * @Note Uses the function writeData(name, data)
   */
  writeDataToPort: writeData,
  /**
   * Writes string data only to a given port until serial port is drained.
   * The promise is rejected when name is undefined, or there is no such port name,
   * or when the port is not opened, or when an error occurs.
   * @param name: port name
   * @param data: string type data to be written to port
   * @Note Uses the function writeAndDrain(name, data)
   */
  writeDataAndDrain: writeAndDrain,
  /**
   * Discards data received but not read, and written but not transmitted by the operating system.
   * The promise is rejected when name is undefined, or there is no such port name,
   * or when the port is not opened, or when an error occurs.
   * The promise is resolved when its executed successfully with a value of [true].
   * @param name: port name
   */
  flushSerialPort: name => {
    return new Promise((resolve, reject) => {
      if (name) {
        if (ports.has(name)) {
          if (ports.get(name).isOpen) {
            ports.get(name).flush(error => {
              if (error) reject(error.message);
              resolve(true);
            });
          } else {
            reject("Port " + name + " is closed!");
          }
        } else {
          reject("There is no such port named: " + name);
        }
      } else {
        reject("Name is Undefined");
      }
    });
  },
  /**
   * Causes a stream in flowing mode to stop emitting 'data' events,
   * switching out of flowing mode. Any data that becomes available remains in the internal buffer.
   * The promise is rejected when name is undefined, or there is no such port name,
   * or when the port is not opened, or when an error occurs.
   * The promise is resolved when its executed successfully with a value of [true].
   * @param name: port name
   */
  pauseEmittingDataEvent: name => {
    return new Promise((resolve, reject) => {
      if (name) {
        if (ports.has(name)) {
          if (ports.get(name).isOpen) {
            ports.get(name).pause();
            resolve(true);
          } else {
            reject("Port " + name + " is closed!");
          }
        } else {
          reject("There is no such port named: " + name);
        }
      } else {
        reject("Name is Undefined");
      }
    });
  },
  /**
   * Causes an explicitly paused, Readable stream to resume emitting 'data' events, switching the stream into flowing mode.
   * The promise is rejected when name is undefined, or there is no such port name,
   * or when the port is not opened, or when an error occurs.
   * The promise is resolved when its executed successfully with a value of [true].
   * @param name: port name
   */
  resumeEmittingDataEvent: name => {
    return new Promise((resolve, reject) => {
      if (name) {
        if (ports.has(name)) {
          if (ports.get(name).isOpen) {
            ports.get(name).resume();
            resolve(true);
          } else {
            reject("Port " + name + "is closed!");
          }
        } else {
          reject("There is no such port named:" + name);
        }
      } else {
        reject("Name is Undefined");
      }
    });
  },
  /**
   * Reads each line in a given gcode file and keeps it in 'codeLines' map if it's a code line,
   * along with counting the number of characters of the current line and keeping the count in 'chars' map,
   * or puts the line in comments map if it's a comment, this function also counts the number of all the lines in the file.
   * All the code lines are stored in '.gcode' file in 'output' directory in a special sub-directory,
   * and the comments in '.txt' file.
   * @param dirName name of the sub-directory in 'output' directory, IT MUST be created otherwise it will throw an error, use 'addOutputDirectorySync' in files.js in 'files_handler' module
   * @param filePath path of gcode file
   * @param fileName name of gcode file without extension
   * @resolve with [true] when successful execution
   * @reject with [error] if an error occurred while reading lines
   */
  readGcodeFileLines: (dirName, filePath, fileName) => {
    return new Promise((resolve, reject) => {
      const gcodeLinesReader = readline.createInterface({
        input: fs.createReadStream(filePath),
        console: false
      });
      gcodeLinesReader.on("line", line => {
        if (line.charAt(0) === ";") {
          comments.set(codeLinesNbr, line);
          //! filesHandler.writeGcodeCommentLine(dirName, fileName, line);
        } else {
          //? temp variable to hold the gcode characters of a line
          let temp = "";
          //? counting the number of characters of a gcode line without the comment chars, that if the line contain comment
          let charsCount = 0;
          for (const i in line) {
            if (line[i] === ";") {
              break;
            } else {
              temp += line[i];
            }
            charsCount++;
          }
          //? plus one is for '\r' char that will be added after
          filesHandler.writeCleanGcodeLine(
            dirName,
            fileName,
            temp,
            charsCount + 1
          );
          //! this char is necessary for gcode parser to distinct between each line
          temp += "\r";
          charsCount++;
          chars.set(codeLinesNbr, charsCount);
          codeLines.set(codeLinesNbr, temp);
        }
        codeLinesNbr++;
      });
      gcodeLinesReader.on("close", () => {
        //? assigning the first line number to start send operation from it
        stoppedIn = codeLines.keys().next().value;
        // console.log(stoppedIn);
        resolve(true);
      });
      gcodeLinesReader.on("error", error => {
        reject(error);
      });
    });
  },
  /**
   * Sends a number of lines that don't pass 127 characters combined,
   * it can be used to resume sending data when there is more room for new line in Serial Receiver Buffer in treatData(), 
   * and also in resumeSendingProcess() hen resuming the stopped process
   * @param portName name of the port
   * @param dirName path of the directory where the log file of send process reside
   * @param logFileName the name of .log file of the current process, WITHOUT extension
   * @param isNewCall boolean value to distinct between new or resumed call of the function
   */
  startSendingProcess: async (portName, dirName, logFileName, isNewCall) => {
    if (stoppedIn != null) {
      //? for global use in the controller
      globalLogFileName = logFileName;
      globalDirName = dirName;
      //? if this call is new, create a new logging file for transmission process ith the first 4 lines
      if (isNewCall) {
        start = Date.now();
        filesHandler.logMessage(
          dirName,
          logFileName,
          "Total lines number: [" + codeLinesNbr + "]",
          true,
          portName,
          "onLog"
        );
        filesHandler.logMessage(
          dirName,
          logFileName,
          "Total lines number of code: [" + codeLines.size + "]",
          true,
          portName,
          "onLog"
        );
        filesHandler.logMessage(
          dirName,
          logFileName,
          "Total lines number of comments: [" + comments.size + "]",
          true,
          portName,
          "onLog"
        );
        filesHandler.logMessage(
          dirName,
          logFileName,
          "Transmitting to port: " + portName,
          true,
          portName,
          "onLog"
        );
        filesHandler.logMessage(
          dirName,
          logFileName,
          "Estimated Time: " + module.exports.getEstimatedTimeToSendCode(),
          true,
          portName,
          "onLog"
        );
      }
      doLoop = true;
      currentPort = portName;
      // const start = Date.now();
      while (doLoop) {
        //? testing if the current line number is not over the last line of code
        if (stoppedIn <= codeLinesNbr) {
          //? ensuring that the rest of chars to be sent is not equal to zero
          if (restToSend != 0) {
            //? ensuring that there is a line with key equal to the current value of stoppedIn
            if (codeLines.has(stoppedIn)) {
              //? ensuring that there is room for current line characters to be sent, in the Serial Receiver buffer
              if (restToSend > chars.get(stoppedIn)) {
                //? ensuring that it is safe to subtract the number of characters of the current line from restToSend value
                if (restToSend - chars.get(stoppedIn) >= 0) {
                  //? performing send operation and wait for it to end
                  isActive = true;
                  await writeAndDrain(portName, codeLines.get(stoppedIn))
                    //* when the send operation is completed
                    .then(result => {
                      filesHandler.logMessage(
                        dirName,
                        logFileName,
                        "Line [N° " + stoppedIn + "] was sent",
                        true,
                        portName,
                        "onLog"
                      );
                      //? subtract the number of chars of the sent line from the restToSend
                      restToSend -= chars.get(stoppedIn);
                      filesHandler.logMessage(
                        dirName,
                        logFileName,
                        "The rest to send after line [N° " +
                        stoppedIn +
                        "] is: " +
                        restToSend,
                        false
                      );
                      //? increment for the next line
                      stoppedIn++;
                    })
                    //* when the send operation is completed with an error indicating the line was not sent!
                    .catch(error => {
                      filesHandler.logMessage(
                        dirName,
                        logFileName,
                        "Line [N° " +
                        stoppedIn +
                        "] was NOT sent, error is [" +
                        error +
                        "]",
                        true,
                        portName,
                        "onLog"
                      );
                    });
                } else {
                  filesHandler.logMessage(
                    dirName,
                    logFileName,
                    "Unsafe to subtract number of characters for line [N° " +
                    stoppedIn +
                    "]",
                    false
                  );
                }
              } else {
                filesHandler.logMessage(
                  dirName,
                  logFileName,
                  "Number of characters of the line [N° " +
                  stoppedIn +
                  "] => [" +
                  chars.get(stoppedIn) +
                  "] is more then the rest to send " +
                  restToSend,
                  false
                );
                isFull = true;
                doLoop = false;
              }
            } else {
              filesHandler.logMessage(
                dirName,
                logFileName,
                "There is no such line [N° " + stoppedIn + "]",
                false
              );
              stoppedIn++;
            }
          } else {
            filesHandler.logMessage(
              dirName,
              logFileName,
              "Max characters is reached, rest to send is: " + restToSend,
              true,
              portName,
              "onLog"
            );
            isFull = true;
            doLoop = false;
          }
        } else {
          //? Using timeout to make sure to get the last 'ok' and then initialize the variables
          setTimeout(() => {
            end = Date.now();
            const t = calculateProcessDuration();
            filesHandler.logMessage(
              dirName,
              logFileName,
              "All lines has been sent, in: " + t,
              true,
              portName,
              "onLog"
            );
            filesHandler.logMessage(
              dirName,
              logFileName,
              "Total of 'Ok' messages received: [" + okCount + "]",
              true,
              portName,
              "onLog"
            );
            filesHandler.logMessage(
              dirName,
              logFileName,
              "Total of 'error' messages received: [" + errorsCount + "]",
              true,
              portName,
              "onLog"
            );
            initializeProcessVariables();
          }, lineSendDuration + 1000);
          isFull = false;
          doLoop = false;
        }
      }
    } else {
      console.error("stoppedIn is UNDEFINED");
    }
  },
  /**
   * Pause send gcode lines operation
   * @param portName name of the port
   */
  pauseSendingProcess: portName => {
    return new Promise((resolve, reject) => {
      if (portName) {
        if (ports.has(portName)) {
          if (ports.get(portName).isOpen) {
            if (globalDirName) {
              if (globalLogFileName) {
                try {
                  doLoop = false;
                  filesHandler.logMessage(
                    globalDirName,
                    globalLogFileName,
                    "Pausing send operation, paused in line [N° " +
                    stoppedIn +
                    "]",
                    true,
                    portName,
                    "onLog"
                  );
                  resolve(true);
                } catch (error) {
                  reject(error);
                }
              } else {
                console.log(
                  "resumeSendingProcess(), .log file name is undefined"
                );
                reject("log file name is undefined");
              }
            } else {
              console.log(
                "resumeSendingProcess(), Output directory is undefined"
              );
              reject("Output directory is undefined");
            }
          } else {
            reject("Port " + portName + " is closed!");
          }
        } else {
          reject("There is no such port named: " + portName);
        }
      } else {
        reject("Port name is undefined");
      }
    });
  },
  /**
   * Resume send gcode lines operation
   * @param portName name of the port
   */
  resumeSendingProcess: portName => {
    return new Promise((resolve, reject) => {
      if (portName) {
        if (ports.has(portName)) {
          if (ports.get(portName).isOpen) {
            if (globalDirName) {
              if (globalLogFileName) {
                module.exports.startSendingProcess(
                  portName,
                  globalDirName,
                  globalLogFileName,
                  false
                );
                filesHandler.logMessage(
                  globalDirName,
                  globalLogFileName,
                  "Resuming send operation, resuming from line [N° " +
                  stoppedIn +
                  "]",
                  true,
                  portName,
                  "onLog"
                );
                resolve(true);
              } else {
                console.log(
                  "resumeSendingProcess(), .log file name is undefined"
                );
                reject(".log file name is undefined");
              }
            } else {
              console.log(
                "resumeSendingProcess(), Output directory is undefined"
              );
              reject("Output directory is undefined");
            }
          } else {
            reject("Port " + portName + " is closed!");
          }
        } else {
          reject("There is no such port named: " + portName);
        }
      } else {
        console.log("resumeSendingProcess(), Port name is undefined");
        reject("Port name is undefined");
      }
    });
  },
  /**
   * Stop send gcode lines operation
   * @param portName name of the port
   */
  stopSendingProcess: portName => {
    return new Promise((resolve, reject) => {
      if (portName) {
        if (ports.has(portName)) {
          if (ports.get(portName).isOpen) {
            if (globalDirName) {
              if (globalLogFileName) {
                doLoop = false;
                setTimeout(() => {
                  filesHandler.logMessage(
                    globalDirName,
                    globalLogFileName,
                    "Stopping send operation, stopped in line [N° " +
                    stoppedIn +
                    "]",
                    true,
                    portName,
                    "onLog"
                  );
                  end = Date.now();
                  const t = calculateProcessDuration();
                  filesHandler.logMessage(
                    globalDirName,
                    globalLogFileName,
                    stoppedIn -
                    comments.size +
                    " lines have been sent, in: " +
                    t,
                    true,
                    portName,
                    "onLog"
                  );
                  initializeProcessVariables();
                  resolve(true);
                }, lineSendDuration + 1000);
              } else {
                console.log(
                  "resumeSendingProcess(), .log file name is undefined"
                );
                reject("log file name is undefined");
              }
            } else {
              console.log(
                "resumeSendingProcess(), Output directory is undefined"
              );
              reject("Output directory is undefined");
            }
          } else {
            reject("Port " + portName + " is closed!");
          }
        } else {
          reject("There is no such port named: " + portName);
        }
      } else {
        console.log("resumeSendingProcess(), Port name is undefined");
        reject("Port name is undefined");
      }
    });
  },
  /**
   * Register on close event for a given port, it will remove the port instance from ports map 
   * and it's corresponding parser from parsers when disconnected for this specific case
   * @param name name of the port
   */
  registerOnCloseEvent: (name) => {
    return new Promise((resolve, reject) => {
      if (name) {
        if (ports.has(name)) {
          if (ports.get(name).isOpen) {
            // console.log("Closing port: " + name);
            ports.get(name).on("close", error => {
              // console.log("in close event -----");
              if (error) {
                console.log("message: " + error.message);
                if (error.disconnected)
                  console.log("Port: " + name + " is disconnected");
              }
              parsers.delete(name);
              ports.delete(name);
            });
            resolve(true);
          } else {
            resolved("Port: " + name + " is already closed!");
          }
        } else {
          reject("There is no such port named: " + name);
        }
      } else {
        reject("Port Name is undefined");
      }
    });
  }
};
/**
 * Treats incoming data from a specific port.
 * this function will resume sending gcode lines when ok response is sent from grbl,
 * which indicates that there is room for more lines in the Serial Receiver Buffer.
 * @param data incoming data value
 * @param portName name of the port that the data came from
 */
treatData = (data, portName) => {
  if (data !== "") {
    const splitted = data.split(":");
    if (data === "ok") {
      okCount++;
      content = `-> Ok is received from port: [${portName}], The count: [${okCount}]`;
    } else if (splitted[0] === "error") {
      errorsCount++;
      content = `-> An error is received from port: [${portName}], The count: [${errorsCount}], error code: [${
        splitted[1]
      }]`;
      //! errors.set(stoppedIn, data);
    } else {
      content = `-> Data is received from port: [${portName}], Raw data: [${data}] `;
    }
    filesHandler.logMessage(
      globalDirName,
      globalLogFileName,
      content,
      true,
      portName,
      "onData"
    );
    //? add the number of chars of the sent line to rest to send
    if (chars.has(stoppedIn - 1)) {
      restToSend += chars.get(stoppedIn - 1);
    }
    //? after assigning true to isFull, that means there is some subtraction is needed to make room for new lines to be sent
    //? but the 'ok' response for some old sent lines was not received
    //? so this code will re-start the sending process after receiving the response from the card
    if (isFull) {
      module.exports.startSendingProcess(
        portName,
        globalDirName,
        globalLogFileName,
        false
      );
      isFull = false;
    }
  } else {
    content = `-> Data is received from port: [${portName}], but it's empty: [${data}]`;
    filesHandler.logMessage(
      globalDirName,
      globalLogFileName,
      content,
      true,
      portName,
      "onData"
    );
  }
};

/**
 * Called by registerOnDataEvent() method to register the event after opening a port by /draw endpoint.
 */
listenToIncomingData = name => {
  if (name) {
    if (ports.has(name)) {
      if (ports.get(name).isOpen) {
        console.log(
          "listening for data started, port: " +
          name +
          ", open status: " +
          ports.get(name).isOpen
        );
        parsers.get(name).on("data", data => {
          treatData(data, name);
        });
      } else {
        console.error("listenToIncomingData: Port " + name + " is closed!");
      }
    } else {
      console.error(
        "listenToIncomingData: There is no such port named: " + name
      );
    }
  } else {
    console.error("listenToIncomingData: Name is Undefined");
  }
};

/**
 * Called by registerOnDataEventForSinglePort() method to register the event after opening a specific port by /open endpoint.
 */
listenToIncomingDataForSinglePort = (name) => {
  if (name) {
    if (ports.has(name)) {
      if (ports.get(name).isOpen) {
        console.log(
          "listening for data started, port: " +
          name +
          ", open status: " +
          ports.get(name).isOpen
        );
        parsers.get(name).on("data", data => {
          socketManager.emitOnSinglePortDataEvent(name, data);
        });
      } else {
        console.error("listenToIncomingData: Port " + name + " is closed!");
      }
    } else {
      console.error(
        "listenToIncomingData: There is no such port named: " + name
      );
    }
  } else {
    console.error("listenToIncomingData: Name is Undefined");
  }
};