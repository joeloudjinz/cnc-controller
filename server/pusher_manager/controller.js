const path = require("path");
const Pusher = require("pusher");

const pusherConfigPath = path.join("..", "config", "pusher.js");
const pusherConfiguration = require(pusherConfigPath);
const pusherObj = new Pusher(pusherConfiguration);

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
};

module.exports = exported;