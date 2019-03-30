const path = require('path');
const bcrypt = require('bcrypt');

const dbConfigPath = path.join('..', 'config', 'database');
const database = require(dbConfigPath);

const connection = database.getConnection();

module.exports = {
    /**
     * insert an agent object into agents table
     * @param agent: object holds all the information of the agent (first name, last name, email and password)
     * @return promise: reject with the error from the database connection instance
     * @return promise: resolve with the result of the query
     * TODO: apply operations logging
     */
    insertAgent: (agent) => {
        const {
            firstName,
            lastName,
            email,
            password
        } = agent;
        return new Promise((resolve, reject) => {
            connection.query('INSERT INTO `agents` (first_name, last_name, email, password) VALUES (?,?,?,?)',
                [firstName, lastName, email, password],
                (error, results, fields) => {
                    // error will be an Error if one occurred during the query
                    if (error) {
                        // console.log("while inserting data, error => " + error);
                        reject(error);
                    }
                    // results will contain the results of the query
                    else {
                        resolve(results);
                    }
                    // fields will contain information about the returned results fields (if any)
                });
        });
    },
    /**
     * verify the uniqueness of an email in the table agents
     * @param email
     * @return promise: reject if there was an error while executing the query
     * @return promise: resolve if the result has more then one row
     * @return promise: reject(false) if there was no row in the result of the query
     * TODO: apply operations logging
     */
    isUniqueEmail: (email) => {
        return new Promise((resolve, reject) => {
            connection.query('SELECT COUNT(id) AS count FROM agents WHERE email=?', [email], (error, results, fields) => {
                if (error) {
                    console.log(error);
                    reject(error);
                } else {
                    if (results[0].count > 0) {
                        reject(false);
                    } else {
                        // console.log(results);
                        resolve();
                    }
                }
            });
        });
    },
    /**
     * verify the uniqueness of an email in the table agents excluding the current user email
     * @param email
     * @return promise: reject if there was an error while executing the query
     * @return promise: resolve if the result has more then one row
     * @return promise: reject(false) if there was no row in the result of the query
     * TODO: apply operations logging
     */
    isUniqueEmailForUpdate: (email, id) => {
        return new Promise((resolve, reject) => {
            connection.query('SELECT COUNT(id) AS count FROM agents WHERE id<>? AND email=?',
                [id, email],
                (error, results, fields) => {
                    if (error) {
                        // console.log(error);
                        reject(error);
                    } else {
                        console.log(results[0].count);
                        if (results[0].count > 0) {
                            reject(false);
                        } else {
                            resolve();
                        }
                    }
                }
            );
        });
    },
    /**
     * get the list of undeleted agents in the system, excluding the admin
     * @returns promise: reject if there was an error while executing the query
     * @returns promise: resolve(result) if the execution was successful
     * TODO: apply operations logging
     */
    getNonDeletedAgents: () => {
        return new Promise((resolve, reject) => {
            connection.query('SELECT id, first_name, last_name, email, is_active FROM agents WHERE is_deleted=0 AND is_admin=0',
                [],
                (error, results, fields) => {
                    if (error) {
                        console.log(error);
                        reject(error);
                    } else {
                        // console.log(results);
                        resolve(results);
                    }
                }
            );
        });
    },
    /**
     * get the information of the agent by his id if he is not deleted
     * @params id: the id of the agent
     * @return promise: reject(error) if there was an error while executing the query
     * @return promise: resolve(result) if the execution was successful
     * TODO: apply operations logging
     */
    getAgentById: (id) => {
        return new Promise((resolve, reject) => {
            connection.query('SELECT id, first_name, last_name, email, is_active FROM agents WHERE id=? AND is_deleted=0',
                [id],
                (error, results, fields) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(results);
                    }
                }
            );
        });
    },
    /**
     * delete an agent data by updating deleted_in and is_deleted properties
     * @params id: the id of the agent
     * @return promise: reject(error) if there was an error while executing the query
     * @return promise: resolve(result) if the execution was successful
     * TODO: apply operations logging
     */
    softDeleteAgent: (id) => {
        return new Promise((resolve, reject) => {
            connection.query('UPDATE agents SET is_deleted=?, deleted_in=?, is_active=? WHERE id=?',
                [true, new Date(), false, id],
                (error, results, fields) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(results);
                    }
                }
            );
        });
    },
    /**
     * delete an agent permanently 
     * @params id: the id of the agent
     * @return promise: reject(error) if there was an error while executing the query
     * @return promise: resolve(result) if the execution was successful
     * TODO: apply operations logging
     */
    hardDeleteAgent: (id) => {
        return new Promise((resolve, reject) => {
            connection.query('DELETE FROM agents WHERE id=?',
                [id],
                (error, results, fields) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(results);
                    }
                }
            );
        });
    },
    /**
     * update agent information, last and first name with email only
     * @params agent object
     * @returns promise: reject(error) if there was an error while executing the query
     * @returns promise: resolve(result) if the execution was successful
     * TODO: apply operations logging
     */
    updateAgentInformation: (agent) => {
        return new Promise((resolve, reject) => {
            connection.query('UPDATE agents SET first_name=?, last_name=?, email=? WHERE id=?',
                [agent.first_name, agent.last_name, agent.email, agent.id],
                (error, results, fields) => {
                    // console.log(agent);
                    if (error) {
                        reject(error);
                    } else {
                        // console.log(results);
                        resolve();
                    }
                }
            );
        });
    },
    /**
     * update agent password
     * @params agent object
     * @returns promise: reject(error) if there was an error while executing the query
     * @returns promise: resolve(result) if the execution was successful
     * TODO: apply operations logging
     */
    updateAgentPassword: (hashed, id) => {
        // console.log(hashed, id);
        return new Promise((resolve, reject) => {
            connection.query('UPDATE agents SET password=? WHERE id=?',
                [hashed, id],
                (error, results, fields) => {
                    // console.log(agent);
                    if (error) {
                        reject(error);
                    } else {
                        console.log(results);
                        resolve();
                    }
                }
            );
        });
    },
    /**
     * Check if the user with the given id is an admin or an agent
     * @params agent id
     * @returns promise: reject(error) if there was an error while executing the query
     * @returns promise: reject(no id) if there is no matching id value
     * @returns promise: resolve(true | false) if the execution was successful
     * TODO: apply operations logging
     */
    isAdmin: (id) => {
        // console.log(id);
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM agents WHERE id=?', [id],
                (error, results, fields) => {
                    if (error) {
                        reject(error);
                    } else {
                        // console.log(results);
                        if (results.length > 0)
                            resolve(results[0].is_admin == 1);
                        else
                            reject(
                                'No Such ID'
                            );
                    }
                }
            );
        });
    },
    /**
     * generate a string of 8 characters 
     * @returns promise: reject(error) if there was an error 
     * @returns promise: resolve(result) if the string was generated successfully
     * TODO: apply operations logging
     */
    generateString: () => {
        let generated = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        return new Promise((resolve, reject) => {
            try {
                for (let i = 0; i < 8; i++)
                    generated += possible.charAt(Math.floor(Math.random() * possible.length));
                resolve(generated);
            } catch (error) {
                reject(error);
            }
        });
    },
};