let io;
let isConnected = false;

module.exports = {
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
    startListening: () => {
        if (isConnected) {
            io.on('connection', function (socket) {
                //? listening to user-connected event emitting from the client side
                socket.on('user-connected', (data) => {
                    console.log('the user with id: ', data.id, ' is reconnected');
                });
            });
        } else {
            console.log('is connected is false!!!');
            return false;
        }
    }
};