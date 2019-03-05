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

module.exports = router;