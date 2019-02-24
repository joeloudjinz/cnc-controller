const express = require('express');
const path = require('path');
const multer = require('multer');

const multerConfigurationPath =  path.join('..', '..', 'config', 'multer');
const multerConfiguration = require(multerConfigurationPath);
const upload = multer(multerConfiguration);

const router = express.Router();



router.post('/upload/img', upload.single('image'), (req, res) => {

});

module.exports = router;