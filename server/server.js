const app = require('express')();
const express = require('express');
const body_parser = require('body-parser');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const dotenv = require('dotenv').config();

if (dotenv.error) {
    console.log("Couldn't parse environment file!", dotenv.error);
}

const credentials = {
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME
};

// console.log('dotenv.parsed :', dotenv.parsed);

const dbConfigPath = path.join(__dirname, 'config', 'database');
const databaseObject = require(dbConfigPath);

// const serverConfigPath = path.join(__dirname, 'config', 'server');
// const serverConfig = require(serverConfigPath);

app.use(helmet());
//? to parse body as json
app.use(body_parser.json());
app.use(cors());

app.use(express.static(__dirname + '/public'));

//? APIs of agent management
const usersManagerPath = path.join(__dirname, 'users_manager', 'routes', 'api');
const usersManagerLocalApis = require(usersManagerPath);
app.use('/api/local/users', usersManagerLocalApis);

//? APIs of authentication
const authenticationPath = path.join(__dirname, 'authentication', 'routes', 'api');
const authenticationApis = require(authenticationPath);
app.use('/api/local/auth', authenticationApis);

//? APIs of Image conversion
const imageConversionPath = path.join(__dirname, 'image_converter', 'routes', 'api');
const imageConversionApis = require(imageConversionPath);
app.use('/api/local/conversions', imageConversionApis);

//? APIs of GCode Handler
const filesHandlerPath = path.join(__dirname, 'files_handler', 'routes', 'api');
const filesHandlerAPI = require(filesHandlerPath);
app.use('/api/local/files', filesHandlerAPI);

const transmitterPath = path.join(__dirname, 'transmitter', 'routes', 'api');
const transmitterAPI = require(transmitterPath);
app.use('/api/local/ports', transmitterAPI);

const transmitterControllerPath = path.join(__dirname, 'transmitter', 'controller.js');
const transmitterController = require(transmitterControllerPath);

const port = process.env.PORT;

const server = app.listen(port, () => {
    console.log('server started at port ' + port);
    databaseObject.initializeConnection(credentials)
        .then((result) => {
            if (result) {
                databaseObject.openConnection();
                console.log("Database object initialized successfully");
            } else
                console.log("Database object wasn't initialized successfully");
        }).catch((error) => {
            console.log("Database object NOT initialized", error);
        });
    // transmitterController.listenToActivePorts();
});

// const socketManagerPath = path.join(__dirname, 'socket_manager', 'controller.js');
// const socketManager = require(socketManagerPath);

// socketManager
//     .initiateSocketIOInstance(server)
//     .then((status) => {
//         console.log('status :', status);
//         socketManager.startListening();
//     }).catch((error) => {
//         console.log(error);
//     });