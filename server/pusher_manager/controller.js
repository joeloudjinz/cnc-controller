const path = require("path");
const Pusher = require("pusher");

const pusherConfigPath = path.join("..", "config", "pusher.js");
const pusherConfiguration = require(pusherConfigPath);
const pusherObj = new Pusher(pusherConfiguration);

module.exports = {
    triggerOnPortData: (portName, content) => {
        if (portName) {
            if (content) {
                pusherObj.trigger("ports", "on-data", {
                    port: portName,
                    data: content
                });
            } else {
                console.log("triggerOnPortData(), content is undefined");
                return false;
            }
        } else {
            console.log("triggerOnPortData(), portName is undefined");
            return false;
        }
    }
};