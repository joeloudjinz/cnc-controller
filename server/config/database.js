const mysql = require('mysql');
const dotenv = require('dotenv').config();

const credentials = {
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME
};

let connection = mysql.createConnection(credentials);

module.exports = {
    // initializeConnection: (credentials) => {
    //     return new Promise(async (resolve, reject) => {
    //         try {
    //             connection = await mysql.createConnection(credentials);
    //             connection != undefined ? resolve(true) : resolve(false);
    //         } catch (error) {
    //             reject(error.message);
    //         }
    //     });
    // },
    openConnection: () => {
        connection.connect((error) => {
            if (error) {
                console.log("database connection error" + error.stack);
                // reject(error);
            } else {
                console.log("connection established, as " + connection.threadId);
                // resolve();
            }
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