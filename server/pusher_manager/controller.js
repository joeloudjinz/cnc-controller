const path = require("path");
const Pusher = require("pusher");

const pusherConfigPath = path.join("..", "config", "pusher.js");
const pusherConfiguration = require(pusherConfigPath);
const pusherObj = new Pusher(pusherConfiguration);
/**
 * There is 2 channels:
 * ports: to handle all messages of port, there is 3 events
 * 1- on-data: used to push data when using /draw endpoint
 * 2- on-active: to push the list of active ports
 * 3- on-port-data; used to push data received after opening a port by /open endpoint
 * logs: to handle all logging messages, there is 1 channel
 * 1- on-log: to push messages of loggings when using /draw endpoint
 */
const exported = class {
    static triggerOnPortData(portName, content) {
        if (portName) {
            if (content) {
                pusherObj.trigger("ports", "on-data", {
                    port: portName,
                    data: content
                });
            } else {
                console.log("triggerOnPortData(), [content] is undefined");
                return false;
            }
        } else {
            console.log("triggerOnPortData(), [portName] is undefined");
            return false;
        }
    }
    static triggerOnLog(portName, content) {
        if (portName) {
            if (content) {
                pusherObj.trigger("logs", "on-log", {
                    // port: portName,
                    data: content
                });
            } else {
                console.log("triggerLogMessages(), [content] is undefined");
                return false;
            }
        } else {
            console.log("triggerLogMessages(), [portName] is undefined");
            return false;
        }
    }
    static triggerOnPortActive(portsList) {
        if (portsList) {
            pusherObj.trigger("ports", "on-active", {
                portsList
            });
        } else {
            console.log("triggerOnPortActive(), [portsList] is undefined");
            return false;
        }
    }
    static triggerOnSinglePortData(portName, data) {
        if (portName) {
            if (data) {
                pusherObj.trigger("ports", "on-port-data", {
                    data
                });
            } else {
                console.log("triggerOnSinglePortData(), [data] is undefined");
                return false;
            }
        } else {
            console.log("triggerOnSinglePortData(), [portName] is undefined");
            return false;
        }
    }
};

module.exports = exported;