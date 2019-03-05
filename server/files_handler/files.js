const fs = require("fs");
const path = require("path");
const root_path = require("app-root-path").path;

const imgDir = path.join(root_path, "server", "resources", "images");
const gcodeDir = path.join(root_path, "server", "resources", "gcodes");

module.exports = {
    moveDotGcode: (oldPath, fileName) => {
        return new Promise(async (resolve, reject) => {
            const newPath = path.join(gcodeDir, fileName);
            await fs.rename(oldPath, newPath, err => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        });
    },
    moveImage: async (oldPath, fileName) => {
        return new Promise(async (resolve, reject) => {
            const newPath = path.join(imgDir, fileName);
            await fs.rename(oldPath, newPath, err => {
                if (err) {
                    reject(err);
                } else {
                    resolve(newPath);
                }
            });
        });
    },
    getGCodeFileStats: fileName => {
        const newPath = path.join(gcodeDir, fileName);
        // console.log(newPath);
        return new Promise((resolve, reject) => {
            fs.access(newPath, async error => {
                if (error) {
                    console.log(error);
                    reject("File Does Not Exist");
                } else {
                    await fs.stat(newPath, (error, stats) => {
                        if (error) {
                            reject(error);
                            console.log(error);
                        } else {
                            // console.log(stats);
                            resolve({
                                size: parseInt(stats["size"]) / 1000000.0
                            });
                        }
                    });
                }
            });
        });
    },
    /**
     * Asynchronous delete of an image after checking the existence of it
     * @param fileName: the name and the extension of the file
     */
    deleteImageFile: fileName => {
        const newPath = path.join(imgDir, fileName);
        console.log(newPath);
        return new Promise((resolve, reject) => {
            fs.access(newPath, async error => {
                if (error) {
                    reject(error);
                } else {
                    await fs.unlink(newPath, error => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(true);
                        }
                    });
                }
            });
        });
    },
    /**
     * Synchronous delete of an image after checking the existence of it
     * @param fileName: the name and the extension of the file
     */
    deleteImageFileSync: fileName => {
        const newPath = path.join(imgDir, fileName);
        console.log(newPath);
        fs.access(newPath, error => {
            if (error) {
                console.log(error);
                return error;
            } else {
                fs.unlinkSync(newPath);
            }
        });
    },
    /**
     * Asynchronous delete of a gcode file after checking the existence of it
     * @param fileName: the name and the extension of the file
     */
    deleteGCodeFile: fileName => {
        const newPath = path.join(gcodeDir, fileName);
        console.log(newPath);
        return new Promise((resolve, reject) => {
            fs.access(newPath, async error => {
                if (error) reject(error);
                else {
                    await fs.unlink(newPath, error => {
                        if (error) reject(error);
                        else {
                            resolve(true);
                        }
                    });
                }
            });
        });
    },
    /**
     * Synchronous delete of a gcode file after checking the existence of it
     * @param fileName: the name and the extension of the file
     */
    deleteGCodeFileSync: fileName => {
        const newPath = path.join(gcodeDir, fileName);
        console.log(newPath);
        fs.access(newPath, error => {
            if (error) {
                console.log(error);
                return error;
            } else {
                fs.unlinkSync(newPath);
            }
        });
    },
    gCodeFileExist: (fileName) => {
        const newPath = path.join(gcodeDir, fileName);
        console.log(newPath);
        return new Promise(async (resolve, reject) => {
            fs.access(newPath, (error) => {
                if (error) {
                    console.log(error);
                    reject(error);
                } else
                    resolve(newPath);
            });
        });
    }
};