//TODO: prepare work space
const express = require('express');
const path = require('path');

const fileHandlerPath = path.join('..', '..', 'files_handler', 'files.js');
const filesHandler = require(fileHandlerPath);

const controllerPath = path.join('..', 'controller');
const controller = require(controllerPath);

const fileName = "sm-sample";
filesHandler.addOutputDirectory("" + Date.now()).then((dirPath) => {
    // console.log(dirPath);
    // console.log('controller :', controller);
    filesHandler.getGcodeFile(fileName).then((filePath) => {
        controller.readGcodeFileLines(dirPath, filePath, fileName).then((result) => {
            console.log('result :', result);
        }).catch((error) => {
            console.log(error);
        });
    }).catch((error) => {
        console.log(error);
    });
}).catch((error) => {
    console.log(error);
});

//TODO: create full draw api endpoint
//TODO: create open port api endpoint
//TODO: create close port api endpoint
//TODO: create write to port api endpoint