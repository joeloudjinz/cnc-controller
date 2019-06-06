const mysql = require('mysql');
// require('dotenv').config();

// console.log(host,
//     user,
//     pass,
//     database);

let connection = undefined;

module.exports = {
    initializeConnection: (credentials) => {
        return new Promise((resolve, reject) => {
            try {
                connection = mysql.createConnection(credentials);
                connection != undefined ? resolve(true) : resolve(false);
            } catch (error) {
                // console.log("Error while initializing database object", );
                reject(error.message);
            }
        });
    },
    openConnection: () => {
        return new Promise((resolve, reject) => {
            connection.connect((error) => {
                if (error) {
                    console.log("database connection error" + error.stack);
                    reject(error);
                } else {
                    console.log("connection established, as " + connection.threadId);
                    resolve();
                }
            });
        });
    },
    closeConnection: () => {
        connection.end((error) => {
            if (error) {
                console.log("database end of connection error" + error.stack);
                return;
            }
            console.log('Connection closed');
        });
    },
    getConnection: () => {
        return connection;
    }
};