let io;
//? used to distinct if the 'io' variable is instantiated or not
let isConnected = false;

// let namespaces = new Map();

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
                socket.on('user-connected', (data) => {
                    console.log('the user with id: ', data.id, ' is reconnected');
                });
            });
        } else {
            return false;
        }
    },
    /**
     * used when opening a port from port panel and send data to that port.
     * this function will push received data from the port to the client.
     * @param portName
     * @param data
     */
    emitOnSinglePortDataEvent: (portName, data) => {
        if (isConnected) {
            io.emit('onSinglePortData', {
                portName,
                data
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
     * @param newListObject
     */
    emitOnPortDataEvent: (portName, content) => {
        if (isConnected) {
            io.emit('onPortData', {
                port: portName,
                data: content
            });
        } else {
            console.log('socket.io is not instantiated');
        }
    },
    /**
     * used when transmitting gcode lines to the machine.
     * this function will push the log messages during transmission process to the client.
     * @param newListObject
     */
    emitOnLogDuringTransmissionEvent: (content) => {
        if (isConnected) {
            io.emit('onTransmissionLog', {
                data: content
            });
        } else {
            console.log('socket.io is not instantiated');
        }
    },
    OnConversionErrorOccursEvent: (content) => {
        if (isConnected) {
            io.emit('onConversionErrorOccurs', {
                data: content
            });
        } else {
            console.log('socket.io is not instantiated');
        }
    },
    emitOnConversionEndsEvent: (content) => {
        if (isConnected) {
            io.emit('onConversionEnds', {
                data: content
            });
        } else {
            console.log('socket.io is not instantiated');
        }
    },
    // emitOnTransmissionEndsEvent: () => {
    //     if (isConnected) {
    //         io.emit('onTransmissionEnds');
    //     } else {
    //         console.log('socket.io is not instantiated');
    //     }
    // },
    emitServerStatusChanged: (status) => {
        if (isConnected) {
            io.emit('onServerStatusChanged', {
                status
            });
        } else {
            console.log('socket.io is not instantiated');
        }
    }
};