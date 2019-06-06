const express = require('express');
const bcrypt = require('bcrypt');
const path = require('path');

const controllerPath = path.join('..', 'controller');
const controller = require(controllerPath);

const router = express.Router();
/**
 * regenerate access and refresh tokens, expects refresh_token, user email and id in the req.body
 * @returns 200 if everything went well, send new access and refresh token to the client
 * @returns 500 if there was an error while regenerating the new tokens
 * @returns 409 (Conflict) if the comparison of the sent token and the one in db failed
 * @returns 406 (Not Acceptable) if the refresh token has expired
 * @returns 401 (Unauthorized) if the token is invalid
 */
router.post('/token/refresh', (req, res) => {
    // get elements from the body request
    const {
        email,
        id,
        refresh_token
    } = req.body;
    // compare the sent token and the one in the db
    controller.compareRefreshTokens(id, refresh_token)
        .then((boolean) => {
            // they matched
            // validate refresh token signature
            controller.validateToken(refresh_token)
                .then((boolean) => {
                    controller.generateToken({
                            email,
                            id
                        })
                        .then((tokens) => {
                            res.status(200).send({
                                success: "Token refreshed successfully",
                                token: tokens.token,
                                refresh_token: tokens.refresh_token
                            });
                        })
                        .catch((error) => {
                            res.status(500).send({
                                failure: "Refreshment process failed, internal error occurred",
                                error
                            });
                        });
                }).catch((error) => {
                    if (error.name === 'TokenExpiredError') {
                        res.status(406).send({
                            failure: 'Not Acceptable, refresh token has expired, login again!',
                            error
                        });
                    } else {
                        return res.status(401).send({
                            failure: 'Unauthorized, invalid refresh token!',
                            error
                        });
                    }
                });
        }).catch((error) => {
            // no match found, old refresh token error
            return res.status(409).send({
                failure: 'Conflict, old refresh token!',
                error
            });
        });
});
/**
 * login endpoint, expects in the request email and password
 * @return 404 if email not found
 * @return 404 if the password mismatch the one in the db
 * @return 200 if the credentials are correct
 * @return 500 if there was an error while comparing the email
 * @return 500 if there was an error while comparing the passwords
 */
router.post('/login', (req, res) => {
    const {
        email,
        password
    } = req.body;
    controller.findAgentByEmail(email)
        .then((agent) => {
            if (agent == false) {
                res.status(404).send({
                    'failure': "Auth failed, these credentials do not match any record in our data center",
                    'error': agent
                });
            } else {
                bcrypt.compare(password, agent.password)
                    .then((result) => {
                        if (result) {
                            controller.deactivateAgent(agent.id, true)
                                .then((result) => {
                                    controller.generateToken({
                                            email,
                                            id: agent.id
                                        })
                                        .then((tokens) => {
                                            const {
                                                first_name,
                                                last_name,
                                                email,
                                                id,
                                            } = agent;
                                            agent = null;
                                            const newAgent = {
                                                first_name,
                                                last_name,
                                                email,
                                                id,
                                            };
                                            res.status(200).send({
                                                success: "Agent was found",
                                                agent: newAgent,
                                                token: tokens.token,
                                                refresh_token: tokens.refresh_token
                                            });
                                        })
                                        .catch((error) => {
                                            res.status(500).send({
                                                failure: "Auth Failed, internal error occurred",
                                                error
                                            });
                                        });
                                }).catch((err) => {
                                    res.status(500).send({
                                        failure: "internal error ocurred, try again",
                                        error
                                    });
                                });
                        } else {
                            res.status(404).send({
                                failure: "Auth failed, these credentials do not match any record in our data center",
                                result
                            });
                        }
                    }).catch((err) => {
                        res.status(500).send({
                            failure: "Auth Failed, internal error occurred",
                            err
                        });
                    });
            }
        }).catch((err) => {
            res.status(500).send({
                failure: "Auth Failed, internal error occurred",
                err
            });
        });
});
/**
 * logout endpoint, change the status of the agent to is_active=false
 * @return 200 if the status changed successfully 
 * @return 500 if there was an error while updating the status
 */
router.post('/logout', (req, res) => {
    controller.deactivateAgent(req.body.id, false)
        .then((result) => {
            res.send({
                'success': 'goodby',
                result
            });
        }).catch((error) => {
            res.status(500).send({
                failure: "internal error ocurred, try again",
                error
            });
        });
});
module.exports = router;