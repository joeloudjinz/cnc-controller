const express = require('express');
const path = require('path');
const multer = require('multer');

const multerConfigurationPath = path.join('..', '..', 'config', 'multer');
const multerConfiguration = require(multerConfigurationPath);
const upload = multer({storage: multerConfiguration});


const controllerPath = path.join('..', 'controller');
const controller = require(controllerPath);

const router = express.Router();

router.post('/upload', upload.single('image'), (req, res) => {
    //? req.file {fieldname, originalname, encoding, mimetype, buffer}
    res.send({
        multerConfiguration,
        file: req.file,
        body: req.body
    })
});

module.exports = router;