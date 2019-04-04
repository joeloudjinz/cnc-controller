const router = require('express').Router();
const path = require('path');

const fileHandlerPath = path.join('..', '..', 'files_handler', 'files');
const filesHandler = require(fileHandlerPath);

const authPath = path.join('..', '..', 'middlewares', 'auth');
const auth = require(authPath);

router.post('/gcode/download', (req, res) => {
    const fileName = req.body.name;
    console.log(req.body);
    console.log(req.body.name);
    if (fileName) {
        filesHandler.gCodeFileExist(fileName)
            .then((filePath) => {
                res.download(filePath);
            })
            .catch((error) => {
                res.status(500).send({
                    failure: "File Does Not Exist!",
                    error
                });
            });
    } else {
        res.status(500).send({
            failure: "No file name was specified!",
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
        .readDirectoryContent(2)
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



module.exports = router;