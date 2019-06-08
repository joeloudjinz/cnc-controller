const path = require('path');
const authControllerPath = path.join('..', 'authentication', 'controller');
const controller = require(authControllerPath);

module.exports = async (req, res, next) => {
    if (req.headers.authorization) {
        const oldToken = req.headers.authorization.split(' ')[1] || req.body.token || req.params.token;
        // console.log('oldToken :', oldToken);
        controller.validateToken(oldToken)
            .then((result) => {
                next();
            }).catch((error) => {
                if (error.name === 'TokenExpiredError') {
                    res.status(406).send({
                        failure: 'Not Acceptable, access token has expired',
                        error
                    });
                } else {
                    return res.status(401).send({
                        failure: 'Unauthorized, invalid access token!',
                        error
                    });
                }
            });
    }else{
        //? 400 => Bad Request
        return res.status(400).send({
            failure: 'Bad Request, No access token!',
        });
    }
    
}