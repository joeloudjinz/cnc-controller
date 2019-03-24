const SerialPort = require("serialport");
//? this is used by the seerial port object to use delimiter parser
const Readline = require("@serialport/parser-readline");
//? this is used by readGcodeFileLines()
const readline = require("readline");
const path = require("path");
const fs = require("fs");
// const Pusher = require("pusher");

const fileHandlerPath = path.join("..", "files_handler", "files.js");
const filesHandler = require(fileHandlerPath);

const pusherManagerPath = path.join("..", "pusher_manager", "controller.js");
const pusherManager = require(pusherManagerPath);

const defaultBaudRate = 115200; //! used for grbl v0.9+

//? holds all the registered ports of the server
let ports = new Map();
//? holds data parsers for each port
let parsers = new Map();

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

let logName;
let outputDirName;

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
            }, 1000);
          } else {
            reject("Data should be of type String");
          }
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
};

writeAndDrain = (name, data) => {
  return new Promise((resolve, reject) => {
    if (name) {
      if (ports.has(name)) {
        if (ports.get(name).isOpen) {
          if (typeof data === "string") {
            console.log("Writing data ...");
            setTimeout(() => {
              ports.get(name).write(data);
              ports.get(name).drain(error => {
                if (error) reject(error);
                resolve(true);
              });
            }, 1000);
          } else {
            reject("Data should be of type String");
          }
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
};

module.exports = {
  /**
   ** Initialize and open a port with a name and a baud rate, the promise is rejected when 'name' is undefined.
   ** puts the port object into ports map.
   * @param name of the port
   * @param buadRate the baud rate for the port
   */
  openPort: (name, baudRate) => {
    return new Promise((resolve, reject) => {
      if (name) {
        // ports.forEach((value, key) => {
        //   console.log("value is: " + value.isOpen);
        //   console.log("key is: " + key);
        // });
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
                console.log("in openPort of controller error :", error);
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
   ** Initialize a delimiter parser for a given port,
   ** the promise is rejected when the port does not exist, or when the port is not opened, or when an error occurs
   * @param name: of the port
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
   ** Return only the valid list of ports, NOT all of them
   ** the promise is rejected when an error occurs
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
            count
          });
        },
        error => reject(error.message)
      );
    });
  },
  /**
   ** closes a port and remove it from 'ports' map along with it's parser from 'parsers' map.
   ** the promise is rejected when name is undefined, or there is no such port name, or when the port is already closed,
   ** or when an error occurs
   * @param name port name
   */
  closePort: name => {
    return new Promise((resolve, reject) => {
      if (name) {
        if (ports.has(name)) {
          //? if it is open, close it
          if (ports.get(name).isOpen) {
            console.log("closing port: " + name);
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
            //? if it is not opened, reject
            resolved("Port: " + name + " is already closed!");
          }
        } else {
          reject("There is no such port named:" + name);
        }
      } else {
        reject("Port Name is undefined");
      }
    });
  },
  /**
   ** Register "on Data" event for a given port, will initialize a parser for the port if no parser is associated with it
   ** the promise is rejected when name is undefined, or there is no such port name, or when the port is not opened.
   * @param name of the port
   * @Note don't use await, it does not work
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
            resolve();
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
   ** Register "on Error" event for a given port
   ** the promise is rejected when name is undefined, or there is no such port name, or when the port is not opened.
   * @param name: of the port
   * TODO: add pusher to push new data to the frontend
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
   *? Uses the function writeData(name, data)
   ** writes string data only to a given port without waiting for the serial port to be drained
   ** the promise is rejected when name is undefined, or there is no such port name,
   ** or when the port is not opened, or when an error occurs
   * @param name: port name
   * @param data: string type data to be written to port
   */
  writeDataToPort: writeData,
  /**
   *? Uses the function writeAndDrain(name, data)
   ** writes string data only to a given port until serial port is drained
   ** the promise is rejected when name is undefined, or there is no such port name,
   ** or when the port is not opened, or when an error occurs
   * @param name: port name
   * @param data: string type data to be written to port
   */
  writeDataAndDrain: writeAndDrain,
  /**
   ** discards data received but not read, and written but not transmitted by the operating system.
   ** the promise is rejected when name is undefined, or there is no such port name,
   ** or when the port is not opened, or when an error occurs
   * @param name: port name
   *! NOT TESTED
   */
  flushSerialPort: name => {
    return new Promise((resolve, reject) => {
      if (name) {
        if (ports.has(name)) {
          if (ports.get(name).isOpen) {
            ports.get(name).flush(error => {
              if (error) reject(error);
              resolve(true);
            });
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
   ** causes a stream in flowing mode to stop emitting 'data' events,
   ** switching out of flowing mode. Any data that becomes available remains in the internal buffer.
   ** the promise is rejected when name is undefined, or there is no such port name,
   ** or when the port is not opened, or when an error occurs
   * @param name: port name
   *! NOT TESTED
   */
  pauseEmittingDataEvent: name => {
    return new Promise((resolve, reject) => {
      if (name) {
        if (ports.has(name)) {
          if (ports.get(name).isOpen) {
            ports.get(name).pause();
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
   ** causes an explicitly paused, Readable stream to resume emitting 'data' events, switching the stream into flowing mode.
   ** the promise is rejected when name is undefined, or there is no such port name,
   ** or when the port is not opened, or when an error occurs
   * @param name: port name
   *! NOT TESTED
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
   ** Reads each line in a given gcode file and keeps it in 'codeLines' map if it's a code line,
   ** along with counting the number of characters of current line and keeping the count in 'chars' map,
   ** or in comments map if it's a comment, this function also counts the number of all the lines in it.
   ** All the code lines are stored in '.gcode' file in 'output' directory in a special sub-directory,
   ** and the comments in '.txt' file
   * @param dirName: name of the sub-directory in 'output' directory, IT MUST be created otherwise it will throw an error, use 'addOutputDirectorySync' in files.js in 'files_handler' module
   * @param fileName: name of gcode file without extension
   * @resolve with [true] if successful execution
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
          filesHandler.writeGcodeCommentLine(dirName, fileName, line);
        } else {
          //? temp variable to hold the gcode characters of a line
          let temp = "";
          //? counting the number of characters of a gcode line without the comment chars
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
   ** Sends a number of lines that don't pass 127 characters combined,
   ** it can be used to resume sending data on Data event is emitted
   * @param dirName name of the directory where the log file of send process reside
   * TODO: empty the maps and initialize variables
   */
  startSendingProcess: async (portName, dirName, logFileName, isNewCall) => {
    if (stoppedIn != null) {
      //? for global use in the controller
      logName = logFileName;
      outputDirName = dirName;
      //? if this call is new, create a new logging file for transmission process ith the first 4 lines
      if (isNewCall) {
        filesHandler.logMessage(
          dirName,
          logFileName,
          "Total lines number: [" + codeLinesNbr + "]"
        );
        filesHandler.logMessage(
          dirName,
          logFileName,
          "Total lines number of code: [" + codeLines.size + "]"
        );
        filesHandler.logMessage(
          dirName,
          logFileName,
          "Total lines number of comments: [" + comments.size + "]"
        );
        filesHandler.logMessage(
          dirName,
          logFileName,
          "Transmitting to port: " + portName
        );
      }
      let b = true;
      while (b) {
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
                  await writeAndDrain(portName, codeLines.get(stoppedIn))
                    //* when the send operation is completed
                    .then(result => {
                      filesHandler.logMessage(
                        dirName,
                        logFileName,
                        "Line [N° " + stoppedIn + "] was sent"
                      );
                      //? deduct the number of chars of the sent line from the restToSend
                      restToSend -= chars.get(stoppedIn);
                      filesHandler.logMessage(
                        dirName,
                        logFileName,
                        "The rest to send after line [N° " +
                        stoppedIn +
                        "] is: " +
                        restToSend
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
                        "]"
                      );
                    });
                } else {
                  filesHandler.logMessage(
                    dirName,
                    logFileName,
                    "Unsafe to deduct number of chars for line [N° " +
                    stoppedIn +
                    "]"
                  );
                }
              } else {
                filesHandler.logMessage(
                  dirName,
                  logFileName,
                  "Number of chars of the line [N° " +
                  stoppedIn +
                  "] => [" +
                  chars.get(stoppedIn) +
                  "] is more then the rest to send " +
                  restToSend
                );
                isFull = true;
                b = false;
              }
            } else {
              filesHandler.logMessage(
                dirName,
                logFileName,
                "There is no such line [N° " + stoppedIn + "] in code lines map"
              );
              stoppedIn++;
            }
          } else {
            filesHandler.logMessage(
              dirName,
              logFileName,
              "Max characters is reached, rest to send is: " + restToSend
            );
            isFull = true;
            b = false;
          }
        } else {
          filesHandler.logMessage(
            dirName,
            logFileName,
            "All lines has been sent, rest to send is: " + restToSend
          );
          codeLines.clear();
          chars.clear();
          comments.clear();
          codeLinesNbr = 0;
          stoppedIn = 0;
          restToSend = 127;
          okCount = 0;
          errorsCount = 0;
          isFull = false;
          // logName = null;
          // outputDirName = null;
          b = false;
        }
      }
    } else {
      console.error("stoppedIn is UNDEFINED");
    }
  }
};
/**
 ** Incoming data treatment from a specific port
 ** this function can resume sending gcode lines when ok response is sent from grbl,
 ** which indicates that there is room for more lines in serial receiver buffer
 * @param data incoming data value
 * @param portName name of the port that the data came from
 * TODO: move the log instruction below 1st if-else
 */
treatData = (data, portName) => {
  if (data !== "") {
    const splitted = data.split(":");
    if (data === "ok") {
      okCount++;
      content = `-> Ok is received from port: [${portName}], The count: [${okCount}]`;
    } else if (splitted[0] === "error") {
      errorsCount++;
      content = `-> An error is received from port: [${portName}], The count: [${errorsCount}], error code: [${data}]`;
      // errors.set(stoppedIn, data);
    } else {
      content = `-> Data is received from port: [${portName}], Raw data: [${data}] `;
    }
    filesHandler.logMessage(outputDirName, logName, content);
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
        outputDirName,
        logName,
        false
      );
      isFull = false;
    }
  } else {
    content = `-> Data is received from port: [${portName}], but it's empty: [${data}] `;
    filesHandler.logMessage(outputDirName, logName, content);
  }
  pusherManager.triggerOnPortData(portName, content);
};

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
          console.log("Data is: " + data);
          treatData(data, name);
        });
      } else {
        console.error("listenToIncomingData: Port " + name + " is closed!");
      }
    } else {
      console.error(
        "listenToIncomingData: There is no such port named:" + name
      );
    }
  } else {
    console.error("listenToIncomingData: Name is Undefined");
  }
};