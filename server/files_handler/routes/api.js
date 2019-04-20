const router = require('express').Router();
const path = require('path');
const fs = require("fs");


const fileHandlerPath = path.join('..', '..', 'files_handler', 'files');
const filesHandler = require(fileHandlerPath);

const authPath = path.join('..', '..', 'middlewares', 'auth');
const auth = require(authPath);

router.get('/download', (req, res) => {
    const filePath = req.query.path;
    if (filePath) {
        filesHandler.readFileLinsIntoArray(filePath)
            .then((result) => {
                res.send({
                    fileLines: result
                });
            }).catch((error) => {
                res.status(500).send({
                    failure: "Couldn't read file lines!",
                    error
                });
            });
    } else {
        res.status(500).send({
            failure: "File path is undefined!",
        });
    }
});

router.get('/display', (req, res) => {
    const imagePath = req.query.path;
    if (imagePath) {
        filesHandler
            .encodeFileIntoBase64(imagePath)
            .then((data) => {
                const ext = imagePath.split(".").reverse()[0];
                res.send({
                    data,
                    ext
                });
            }).catch((error) => {
                res.status(500).send({
                    failure: "Couldn't read the file!",
                    error
                });
            });
    } else {
        res.status(404).send({
            failure: "File path is undefined!",
        });
    }
});

/**
 * get all the files in resources directory
 */
router.get('/', (req, res) => {
    let tree = {};
    filesHandler
        .readDirectoryContent(1)
        .then((result) => {
            tree.Images = result;
            filesHandler
                .readDirectoryContent(2)
                .then((result) => {
                    tree.Gcodes = result;
                    filesHandler
                        .readDirectoryContent(3)
                        .then((result) => {
                            tree.Outputs = result;
                            res.send({
                                ...tree
                            });
                        }).catch((error) => {
                            console.log(error);
                        });
                }).catch((error) => {
                    console.log(error);
                });
        }).catch((error) => {
            console.log(error);
        });
});
/**
 * get data of all images in images directory
 */
router.get('/images/', (req, res) => {
    let tree = {};
    filesHandler
        .readDirectoryContent(1)
        .then((result) => {
            tree.Images = result;
            res.send(tree);
        }).catch((error) => {
            console.log(error);
        });
});
/**
 * get data of all g-code files in g-codes directory
 */
router.get('/gcodes/', (req, res) => {
    let tree = {};
    filesHandler
        .readDirectoryContent(2)
        .then((result) => {
            tree.Gcodes = result;
            res.send(tree);
        }).catch((error) => {
            console.log(error);
        });
});
/**
 * get data of all files in the subdirectories of 'outputs' directory
 */
router.get('/outputs/', (req, res) => {
    let tree = {};
    filesHandler
        .readDirectoryContent(3)
        .then((result) => {
            tree.Outputs = result;
            res.send(tree);
        }).catch((error) => {
            console.log(error);
        });
});

/**
 * delete gcode file from gcodes directory
 * TODO: add auth middleware
 */
router.delete('/gcodes', (req, res) => {
    const fileName = req.query.fileName;
    if (fileName) {
        filesHandler
            .deleteGCodeFile(fileName)
            .then((result) => {
                res.send({
                    success: "File deleted successfully"
                });
            }).catch((error) => {
                res.status(500).send({
                    failure: "An error occurred while deleting file",
                    error
                });
            });
    } else {
        res.status(404).send({
            failure: "File name is undefined"
        });
    }
});
/**
 * delete an output subdirectory
 * TODO: add auth middleware
 */
router.delete('/outputs', (req, res) => {
    const dirName = req.query.dirName;
    if (dirName) {
        filesHandler
            .deleteOutputDirectory(dirName)
            .then((result) => {
                res.send({
                    success: "Directory deleted successfully"
                });
            }).catch((error) => {
                console.log(error);
                res.status(500).send({
                    failure: "An error occurred while deleting directory",
                    error
                });
            });
    } else {
        res.status(404).send({
            failure: "File name is undefined"
        });
    }
});
/**
 * TODO: add delete image file endpoint
 */

module.exports = router;