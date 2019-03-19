const SerialPort = require("serialport");
const Readline = require("@serialport/parser-readline");
const path = require("path");

const defaultBaudRate = 115200; //! used for grbl v0.9+

//? holds all the registered ports of the server
let ports = new Map();
//? holds data parsers for each port
let parsers = new Map();

module.exports = {
  /**
   ** Initialize and open a port with a name and a baud rate, the promise is rejected when 'name' is undefined.
   ** put the port object into ports map.
   * @param name: of the port
   * @param buadRate: the baud rate for the port
   */
  openPort: (name, baudRate) => {
    return new Promise((resolve, reject) => {
      if (name) {
        if (ports.has(name)) {
          reject(
            "Port: " +
              name +
              " is initialized already, open status: " +
              ports.get(name).isOpen
          );
        } else {
          const port = new SerialPort(
            name,
            {
              baudRate: baudRate || defaultBaudRate
            },
            error => {
              if (error) reject(error);
              console.log("Port: " + name + " is opened");
              ports.set(name, port);
              resolve(true);
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
   * TODO: test is name undefined!
   */
  initializeDelimiterParser: name => {
    return new Promise((resolve, reject) => {
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
            reject(error);
          }
        } else {
          reject("Port " + name + "is closed!");
        }
      } else {
        reject("There is no such port named:" + name);
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
          let validPorts = [];
          ports.forEach(element => {
            if (element.productId) {
              validPorts += element;
            }
          });
          resolve(validPorts);
        },
        error => reject(error)
      );
    });
  },
  /**
   ** closes a port and remove it from 'ports' map along with it's parser from 'parsers' map.
   ** the promise is rejected when name is undefined, or there is no such port name, or when the port is already closed,
   ** or when an error occurs
   * @param name: port name
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
                reject(false);
              }
              parsers.delete(name);
              ports.delete(name);
              resolve(true);
            });
          } else {
            //? if it is not opened, reject
            reject("Port: " + name + " is already closed!");
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
   * @param name: of the port
   * TODO: add pusher to push new data to the frontend
   */
  registerOnDataEvent: name => {
    return new Promise((resolve, reject) => {
      if (name) {
        if (ports.has(name)) {
          if (ports.get(name).isOpen) {
            if (parsers.has(name)) {
              setTimeout(() => {
                console.log(
                  "listening for data started with parser, port: " +
                    name +
                    ", open status: " +
                    ports.get(name).isOpen
                );
                parsers.get(name).on("data", data => {
                  console.log("Data is: " + data);
                });
              }, 1000);
            } else {
              initializeDelimiterParser(portName)
                .then(result => {
                  setTimeout(() => {
                    console.log(
                      "listening for data started with parser, port: " +
                        name +
                        ", open status: " +
                        ports.get(name).isOpen
                    );
                    parsers.get(name).on("data", data => {
                      console.log("Data is: " + data);
                    });
                  }, 1000);
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
   ** writes string data only to a given port without waiting for the serial port to be drained
   ** the promise is rejected when name is undefined, or there is no such port name,
   ** or when the port is not opened, or when an error occurs
   * @param name: port name
   * @param data: string type data to be written to port
   */
  writeDataToPort: (name, data) => {
    return new Promise((resolve, reject) => {
      if (name) {
        if (ports.has(name)) {
          if (ports.get(name).isOpen) {
            if (typeof data === "string") {
              ports.get(name).write(data, error => {
                if (error) reject(error);
                resolve(true);
              });
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
  },
  /**
   ** writes string data only to a given port until serial port is drained
   ** the promise is rejected when name is undefined, or there is no such port name,
   ** or when the port is not opened, or when an error occurs
   * @param name: port name
   * @param data: string type data to be written to port
   */
  writeDataAndDrain: (name, data) => {
    return new Promise((resolve, reject) => {
      if (name) {
        if (ports.has(name)) {
          if (ports.get(name).isOpen) {
            if (typeof data === "string") {
              console.log("Writing data ...");
              ports.get(name).write(data);
              ports.get(name).drain(error => {
                if (error) reject(error);
                resolve(true);
              });
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
  },
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
  }
};
