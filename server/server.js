const app = require('express')();
// const http = require('http').Server(app);

const body_parser = require('body-parser');
const cors = require('cors');
const path = require('path');

const dbConfigPath = path.join(__dirname, 'config', 'database');
const database = require(dbConfigPath);

const serverConfigPath = path.join(__dirname, 'config', 'server');
const serverConfig = require(serverConfigPath);

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

const transmitterControllerPath = path.join(__dirname, 'transmitter', 'controller.js');
const transmitterController = require(transmitterControllerPath);

const port = serverConfig.PORT;

const server = app.listen(port, () => {
    console.log('server started at port ' + port);
    database.openConnection();
    transmitterController.listenToActivePorts();
});

const io = require('socket.io')(server);

io.on('connection', function (socket) {
    //? listening to user-connected event emitting from the client side
    socket.on('user-connected', (data) => {
        console.log('the user with id: ', data.id, ' is reconnected');
    });
});