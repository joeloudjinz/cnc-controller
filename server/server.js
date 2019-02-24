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
const agentsManagementLocalApis = require('./agents_management/routes/local_api');
app.use('/api/local/agents', agentsManagementLocalApis);
//? APIs of authentication
const authenticationApis = require('./authentication/routes/api');
app.use('/api/local/auth', authenticationApis);

const port = server.PORT;

app.listen(port, () => {
    console.log('server started at port ' + port);
    database.openConnection();

});