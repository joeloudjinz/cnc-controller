const express = require('express');
const body_parser = require('body-parser');
const cors = require('cors');
const path = require('path');

const dbConfigPath = path.join(__dirname, 'config', 'database');
const database = require(dbConfigPath);

const serverConfigPath = path.join(__dirname, 'config', 'server');
const server = require(serverConfigPath);

const app = express();

//? to parse body as json
app.use(body_parser.json());
app.use(cors());

//? APIs of agent management
const agentsManagementPath = path.join(__dirname, 'agents_management', 'routes', 'local_api');
const agentsManagementLocalApis = require(agentsManagementPath);
app.use('/api/local/agents', agentsManagementLocalApis);

//? APIs of authentication
const authenticationPath = path.join(__dirname, 'authentication', 'routes', 'api');
const authenticationApis = require(authenticationPath);
app.use('/api/local/auth', authenticationApis);

//? APIs of Image conversion
const imageConversionPath = path.join(__dirname, 'image_converter', 'routes', 'api');
const imageConversionApis = require(imageConversionPath);
app.use('/api/local/images', imageConversionApis);

//? APIs of GCode Handler
const filesHandlerPath = path.join(__dirname, 'files_handler', 'routes', 'api');
const filesHandlerAPI = require(filesHandlerPath);
app.use('/api/local/files', filesHandlerAPI);

const transmitterPath = path.join(__dirname, 'transmitter', 'routes', 'api');
const transmitterAPI = require(transmitterPath);
app.use('/api/local/ports', transmitterAPI);

const port = server.PORT;

app.listen(port, () => {
    console.log('server started at port ' + port);
    database.openConnection();

});