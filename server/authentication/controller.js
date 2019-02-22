const jwt = require('jsonwebtoken');
const database = require('../config/database');
const secret = 'loujein-0000-inno-acad';

module.exports = {
    /**
     * verify the existence of the sent email in the request
     * @param email: email from the login page
     * @return the corresponding row of the agent, if any, else return false
     * TODO: add operations logging
     */
    findAgentByEmail: (email) => {
        return new Promise((resolve, reject) => {
            database
                .getConnection()
                .query('SELECT * FROM agents WHERE email=? AND is_deleted=?', [email, false], (error, results, fields) => {
                    if (error) {
                        // console.log(error);
                        reject(error);
                    } else {
                        if (results.length > 0) {
                            resolve(results[0]);
                        } else {
                            resolve(false);
                        }
                    }
                });
        });
    },
    generateToken: (user) => {
        const {
            email,
            id
        } = user;
        return new Promise((resolve, reject) => {
            jwt.sign({
                email: email,
                id: id,
                date: new Date()
            }, secret, {
                expiresIn: "5m"
            }, (error, token) => {
                if (error) {
                    // console.log(error);
                    reject(error);
                } else {
                    //? generating refresh token
                    jwt.sign({
                        token,
                        date: new Date()
                    }, secret, {
                        expiresIn: "1h"
                    }, (error, refresh_token) => {
                        if (error) {
                            reject(error);
                        } else {
                            // console.log(id);
                            database.getConnection().query('UPDATE agents SET refresh_token=? WHERE id=?',
                                [refresh_token, id],
                                (error, results, fields) => {
                                    if (error) {
                                        // console.log(error);
                                        reject(error);
                                    } else {
                                        // console.log(results);
                                        resolve({
                                            token,
                                            refresh_token
                                        });
                                    }
                                });
                        }
                    });
                }
            });
        });
    },
    compareRefreshTokens: (id, refresh_token) => {
        return new Promise((resolve, reject) => {
            console.log(id, refresh_token);
            database.getConnection().query('SELECT COUNT(id) AS counts FROM agents WHERE id=? AND refresh_token=?',
                [id, refresh_token],
                (error, results, fields) => {
                    if (error) {
                        reject(error);
                    } else {
                        //? to know the results => console.log(results[0].counts);
                        if (results[0].counts > 0) {
                            resolve(true);
                        } else {
                            reject(false);
                        }
                    }
                })
        });
    },
    deactivateAgent: (id) => {
        return new Promise((resolve, reject) => {
            database
                .getConnection()
                .query('UPDATE agents SET is_active=? WHERE id=?', [false, id], (error, results, fields) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(results);
                    }
                });
        });
    },
    validateToken: (token) => {
        return new Promise((resolve, reject) => {
            jwt.verify(token, 'loujein-0000-inno-acad', (error, decoded) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(true);
                }
            });
        });
    }
}