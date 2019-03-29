const mysql = require('mysql');

const host = 'localhost';
const user = 'root';
const pass = '';
const database = 'cnc_iiot';

const connection = mysql.createConnection({
    host: host,
    user: user,
    password: pass,
    database: database
});

module.exports = {
    openConnection: () => {
        return new Promise((resolve, reject) => {
            connection.connect((error) => {
                if (error) {
                    console.log("database connection error" + error.stack);
                    reject(error);
                }else{
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