const express = require('express');
const bcrypt = require('bcrypt');
const path = require('path');

const controllerPath = path.join('..', 'controller');
const controller = require(controllerPath);

const authPath = path.join('..', '..', 'middlewares', 'auth');
const auth = require(authPath);

const router = express.Router();

/**
 * agent registration endpoint, expects in the request first name, last name, email and password
 * verify at first the uniqueness of email address then hash the password, then inserting the data into database
 * @return 201(created) when agent is created successfully
 * @return 500(internal server error) if there was an error while hashing the password
 * @return 500(internal server error) if there was an error while inserting data
 * @return 409(conflict) if the email address already exist
 * TODO: apply operations logging
 */
router.post('/create', auth, (req, res) => {
    const {
        firstName,
        lastName,
        email,
        password
    } = req.body;
    controller.isUniqueEmail(email)
        .then(() => {
            bcrypt.hash(password, 10)
                .then((hashed) => {
                    controller.insertAgent({
                            firstName,
                            lastName,
                            email,
                            password: hashed
                        })
                        .then((results) => {
                            res.status(201).send({
                                success: "A new Agent was added successfully",
                                data: results
                            });
                        })
                        .catch((error) => {
                            res.status(500).send({
                                failure: 'An error occurred while inserting data',
                                error: error
                            });
                        });
                })
                .catch((err) => {
                    res.status(500).send({
                        failure: 'An error occurred while hashing password',
                        error: err
                    });
                });
        })
        .catch((error) => {
            res.status(409).send({
                failure: 'Email address already exist, enter a unique one',
                error: error
            });
        });
});
/**
 * non deleted agents list endpoint
 * @returns the list of the agents who aren't deleted and not admins
 * @returns 500 if the query executed unsuccessfully
 * @returns 200 if it's successful
 * TODO: apply operations logging
 */
router.get('/', auth, (req, res) => {
    controller.getNonDeletedAgents()
        .then((result) => {
            res.send({
                data: result
            });
        }).catch((err) => {
            res.status(500).send({
                failure: 'An error occurred while retrieving data',
                error: err
            });
        });
});
/**
 * non deleted agent information endpoint
 * @returns the information of the agent
 * @returns 500 if the query executed unsuccessfully
 * @returns 200 if it's successful
 * TODO: apply operations logging
 */
router.get('/:id', auth, (req, res) => {
    controller.getAgentById(req.params.id)
        .then((result) => {
            res.send({
                data: result
            });
        }).catch((err) => {
            res.status(500).send({
                failure: 'An error occurred while retrieving data',
                error: err
            });
        });
});
/**
 * agent information's update endpoint
 * @return 500(internal server error) if there was an error while updating data
 * @return 409(conflict) if the email address already exist
 * TODO: apply operations logging 
 */
router.put('/:id', auth, (req, res) => {
    const {
        last_name,
        first_name,
        email,
        // password
    } = req.body;
    const id = req.params.id;
    controller.isUniqueEmailForUpdate(email, id)
        .then(() => {
            controller.updateAgentInformation({
                last_name,
                first_name,
                email,
                // hashed,
                id
            }).then(() => {
                res.send({
                    success: "Information updated successfully",
                    last_name,
                    first_name,
                    email,
                    id
                });
            }).catch((error) => {
                res.status(500).send({
                    failure: 'An error occurred while updating information, try again',
                    error: error
                });
            });
        }).catch((error) => {
            res.status(409).send({ //? 409 conflict 
                failure: 'Email address already exist, enter a unique one',
                error: error
            });
        });
});
/**
 * update agent password endpoint
 * @returns 500 if the query executed unsuccessfully
 * @returns 500 if the there was an error while hashing the new password
 * @returns 200 if it's successful
 * TODO: apply operations logging
 */
router.put('/password/:id', auth, (req, res) => {
    const password = req.body.password;
    const id = req.params.id;
    bcrypt.hash(password, 10)
        .then((hashed) => {
            controller.updateAgentPassword(hashed, id)
                .then(() => {
                    res.send({
                        success: "Information updated successfully",
                    })
                }).catch((error) => {
                    res.status(500).send({
                        failure: 'An error occurred while updating information, try again',
                        error: error
                    });
                });
        }).catch((error) => {
            res.status(500).send({
                failure: 'An error occurred while hashing password',
                error: error
            });
        });
});
/**
 * soft delete agent endpoint
 * @returns the information of the agent
 * @returns 500 if the query executed unsuccessfully
 * @returns 200 if it's successful
 * TODO: apply operations logging
 */
router.delete('/:id', auth, (req, res) => {
    controller.softDeleteAgent(req.params.id)
        .then((result) => {
            res.send({
                success: "Agent was deleted successfully",
            })
        }).catch((err) => {
            res.status(500).send({
                failure: 'An error occurred while updating data',
                error: err
            })
        });
})
/**
 * get the role (admin or agent) of a given agent id
 * @returns 200 true or false if the execution of the operation was successful
 * @returns 500 if the query executed unsuccessfully
 * @returns 404 if the id was wrong
 * TODO: apply operations logging
 */
router.post('/role', auth, (req, res) => {
    const id = req.body.id;
    controller.isAdmin(id)
        .then((result) => {
            res.send({
                success: 'Operation completed successfully',
                result
            })
        }).catch((error) => {
            if (error === 'No Such ID') {
                res.status(404).send({
                    failure: 'No Such ID found!',
                });
            } else {
                res.status(500).send({
                    failure: 'An error occurred while retrieving data',
                    error: error
                });
            }
        });

});
/**
 * reset agent password with random one
 */
router.get('/reset/:id', (req, res) => {
    console.log(req.params.id);
    //! test if id is defined
    if (req.params.id) {
        const id = req.params.id;
        // generate password
        controller.generateString()
            .then((generated) => {
                // hash password
                // console.log(generated);
                bcrypt.hash(generated, 10)
                    .then((hashed) => {
                        // store the new password
                        controller.updateAgentPassword(hashed, id)
                            .then(() => {
                                res.send({
                                    success: "Information updated successfully",
                                    password: generated
                                })
                            }).catch((error) => {
                                res.status(500).send({
                                    failure: 'An error occurred while updating information, try again',
                                    error: error
                                });
                            });
                    }).catch((error) => {
                        res.status(500).send({
                            failure: 'An error occurred while hashing password',
                            error
                        });
                    });
            }).catch((error) => {
                res.status(500).send({
                    failure: 'Internal error occurred, try again!',
                    error
                });
            });
    } else {
        res.status(400).send({
            failure: 'Bad Request, No id was specified!'
        });
    }
});
module.exports = router;