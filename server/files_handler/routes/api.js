const router = require('express').Router();
const path = require('path');


const fileHandlerPath = path.join('..', '..', 'files_handler', 'files');
const filesHandler = require(fileHandlerPath);

const authPath = path.join('..', '..', 'middlewares', 'auth');
const auth = require(authPath);

const socketManagerPath = path.join("..", "..", "socket_manager", "controller.js");
const socketManager = require(socketManagerPath);

/**
 * get the content of a file, either .gcode or .log
 * TODO: add auth middleware
 */
router.get('/download', (req, res) => {
    const filePath = req.query.path;
    if (filePath) {
        filesHandler.doesFileExist(filePath)
            .then((result) => {
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
            }).catch((error) => {
                res.status(404).send({
                    failure: "File does not exist anymore!",
                    error
                });
            });
    } else {
        res.status(500).send({
            failure: "File path is undefined!",
        });
    }
});

/**
 * return base64 of an image in 'images' directory
 * TODO: add auth middleware
 */
router.get('/display', (req, res) => {
    const imagePath = req.query.path;
    if (imagePath) {
        filesHandler.doesFileExist(imagePath)
            .then((result) => {
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
            }).catch((error) => {
                res.status(404).send({
                    failure: "File does not exist anymore!",
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
 * TODO: add auth middleware
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
 * delete gcode file from gcodes directory
 * TODO: add auth middleware
 */
router.delete('/gcodes', (req, res) => {
    const fileName = req.query.fileName;
    if (fileName) {
        filesHandler
            .deleteGCodeFile(fileName)
            .then((result) => {
                if (result) {
                    socketManager.emitGcodeFileDeleted(fileName);
                    res.send({
                        success: "File deleted successfully"
                    });
                } else {
                    res.status(404).send({
                        failure: "File does not exist anymore!"
                    });
                }
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
 * delete a given output subdirectory
 * TODO: add auth middleware
 */
router.delete('/outputs', (req, res) => {
    const dirName = req.query.dirName;
    if (dirName) {
        filesHandler
            .deleteOutputDirectory(dirName)
            .then((result) => {
                if (result) {
                    socketManager.emitOutputSubDirectoryDeleted(dirName);
                    res.send({
                        success: "Directory deleted successfully"
                    });
                } else {
                    res.status(404).send({
                        failure: "Directory does not exist anymore!"
                    });
                }
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
 * Delete an image and it's corresponding gcode file if exists
 * TODO: add auth middleware
 */
router.delete('/images', (req, res) => {
    const imageName = req.query.imageName;
    if (imageName) {
        filesHandler
            .deleteImageFile(imageName)
            .then((result) => {
                //? the file exist and it was deleted
                if (result) {
                    const splitted = imageName.split('.');
                    //! NOTE: if the filename is not like the usual, it will be like 'name.ext.gcode'
                    const fileName = splitted[0] + "." + splitted[1] + ".gcode";
                    //? delete the corresponding gcode file
                    filesHandler.deleteGcodeFileSync(fileName);
                    socketManager.emitImageDeleted(imageName);
                    res.send({
                        success: "Image deleted successfully"
                    });
                } else {
                    //? the file does not exist in 'images' directory
                    res.status(404).send({
                        failure: "File does not exist anymore!"
                    });
                }
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
 * get data of all images in images directory
 * TODO: add auth middleware
 * @Note NOT used
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
 * TODO: add auth middleware
 * @Note NOT used
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
 * TODO: add auth middleware
 * @Note NOT used
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


module.exports = router;