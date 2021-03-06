let io;
//? used to distinct if the 'io' variable is instantiated or not
const path = require('path');

// const controllerPath = path.join('..', 'authentication', 'controller');
// const authenticationController = require(controllerPath);

let isConnected = false;

module.exports = {
    /**
     * initiate socket.io instance.
     * @Note this function should be called one time only from the entry point of the server
     * @param server the server instance of http
     */
    initiateSocketIOInstance: (server) => {
        return new Promise((resolve, reject) => {
            try {
                io = require('socket.io')(server);
                isConnected = true;
                resolve(true);
            } catch (error) {
                isConnected = false;
                reject(error);
            }
        });
    },
    /**
     * used to start listening for emitted events from the client side.
     * @Note this function should be called one time only from 
     * the entry point of the server after resolving the promise of 'initiateSocketIOInstance'.
     */
    startListening: () => {
        if (isConnected) {
            io.on('connection', function (socket) {
                //? listening to user-connected event emission from the client side
                // socket.on('changeUserActiveState', (data) => {
                //     console.log("data is ", data);
                //     authenticationController.deactivateAgent(data.id, data.state);
                // });
            });
        } else {
            return false;
        }
    },
    /**
     * used when opening a port from port panel and send data to that port.
     * this function will push received data from the port to the client.
     * @param id
     * @param state
     */
    // emitOnUserAccountStatusChanged: (id, state) => {
    //     if (isConnected) {
    //         io.emit('userAccountStateChanged', {
    //             id,
    //             state
    //         });
    //     } else {
    //         console.log('socket.io is not instantiated');
    //     }
    // },
    /**
     * used when opening a port from port panel and send data to that port.
     * this function will push received data from the port to the client.
     * @param portName
     * @param data
     * @param target to whom the data should be pushed to
     */
    emitOnSinglePortDataEvent: (portName, data, target) => {
        if (isConnected) {
            io.emit('onSinglePortData', {
                portName,
                data,
                target
            });
        } else {
            console.log('socket.io is not instantiated');
        }
    },
    /**
     * used when detecting a newly connected device to the server. 
     * this function will push the new list of connected ports to the client.
     * @param newListObject
     */
    emitOnPortActiveEvent: (newListObject) => {
        if (isConnected) {
            io.emit('onPortsListChanged', newListObject);
        } else {
            console.log('socket.io is not instantiated');
        }
    },
    /**
     * used when transmitting gcode lines to the machine.
     * this function will push received data from the port during transmission process to the client.
     * @param portName
     * @param content
     * @param target to whom the data should be pushed to
     */
    emitOnPortDataEvent: (portName, content, target) => {
        if (isConnected) {
            io.emit('onPortData', {
                port: portName,
                data: content,
                target: target
            });
        } else {
            console.log('socket.io is not instantiated');
        }
    },
    /**
     * used when transmitting gcode lines to the machine.
     * this function will push the log messages during transmission process to the client.
     * @param content
     * @param target to whom the data should be pushed to
     */
    emitOnLogDuringTransmissionEvent: (content, target) => {
        if (isConnected) {
            io.emit('onTransmissionLog', {
                data: content,
                target: target
            });
        } else {
            console.log('socket.io is not instantiated');
        }
    },
    /**
     * used to inform the client about the state of the server if it's active or not
     * @param status the current state of the server 
     */
    emitServerStatusChanged: (status, target) => {
        if (isConnected) {
            io.emit('onServerStatusChanged', {
                status,
                target
            });
        } else {
            console.log('socket.io is not instantiated');
        }
    },
    /**
     * used to update files tree in the client when deleting gcode file
     * @param fileName gcode file name 
     */
    emitGcodeFileDeleted: (fileName) => {
        if (isConnected) {
            io.emit('onGcodeFileDeleted', {
                fileName
            });
        } else {
            console.log('socket.io is not instantiated');
        }
    },
    /**
     * used to update files tree in the client when deleting output subdirectory
     * @param fileName gcode file name 
     */
    emitOutputSubDirectoryDeleted: (dirName) => {
        if (isConnected) {
            io.emit('onOutputSubDirectoryDeleted', {
                dirName
            });
        } else {
            console.log('socket.io is not instantiated');
        }
    },
    /**
     * used to update files tree in the client when an image is deleted
     * @param fileName gcode file name 
     */
    emitImageDeleted: (imageName) => {
        if (isConnected) {
            io.emit('onImageDeleted', {
                imageName
            });
        } else {
            console.log('socket.io is not instantiated');
        }
    },
    /**
     * used to update files tree in the client when new gcode file is added to the directory
     * @param fileName gcode file name 
     */
    emitGcodeFileAdded: (fileDetailsObject) => {
        if (isConnected) {
            io.emit('onGcodeFileAdded', fileDetailsObject);
        } else {
            console.log('socket.io is not instantiated');
        }
    },
    /**
     * used to update files tree in the client when new image is added to the directory
     * @param fileName gcode file name 
     */
    emitImageAdded: (fileDetailsObject) => {
        if (isConnected) {
            io.emit('onImageAdded', fileDetailsObject);
        } else {
            console.log('socket.io is not instantiated');
        }
    },
    /**
     * used to inform the client that the conversion process has ended
     * @param conversionDetails details of the conversion process 
     * @param target to whom the data should be pushed to
     */
    emitConversionEnded: (conversionDetails, target) => {
        if (isConnected) {
            io.emit('onConversionEnded', {
                conversionDetails,
                target
            });
        } else {
            console.log('socket.io is not instantiated');
        }
    },
    /**
     * used to inform the client that an error occurred during conversion process
     * @param errorDetails details of the error 
     * @param target to whom the data should be pushed to
     */
    emitConversionErrorOccur: (errorDetails, target) => {
        if (isConnected) {
            io.emit('onConversionErrorOccur', {
                errorDetails,
                target
            });
        } else {
            console.log('socket.io is not instantiated');
        }
    },
    /**
     * used to inform the client that the quick conversion process has ended
     * @param conversionDetails details of the quick conversion process 
     * @param target to whom the data should be pushed to
     */
    emitQuickConversionEnded: (conversionDetails, target) => {
        if (isConnected) {
            io.emit('onQuickConversionEnded', {
                conversionDetails,
                target
            });
        } else {
            console.log('socket.io is not instantiated');
        }
    },
    /**
     * used to inform the client that the quick conversion process has ended
     * @param conversionDetails details of the quick conversion process 
     * @param target to whom the data should be pushed to
     */
    emitQuickConversionErrorOccur: (errorDetails, target) => {
        if (isConnected) {
            io.emit('onQuickConversionErrorOccur', {
                errorDetails,
                target
            });
        } else {
            console.log('socket.io is not instantiated');
        }
    },
    /**
     * used to inform the client that a user was added
     * @param user the data of the new user
     */
    emitOnNewUserAdded: (user) => {
        if (isConnected) {
            console.log("new user added", user[0]);
            io.emit('onNewUserAdded', {
                user: user[0]
            });
        } else {
            console.log('socket.io is not instantiated');
        }
    },
    /**
     * used to inform the client that a user was deleted
     * @param userId the id of the deleted user
     */
    emitOnUserDeleted: (userId) => {
        if (isConnected) {
            io.emit('onUserDeleted', {
                userId
            });
        } else {
            console.log('socket.io is not instantiated');
        }
    }
};