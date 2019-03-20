const fs = require("fs");
const path = require("path");
const root_path = require("app-root-path").path;

const imgDir = path.join(root_path, "server", "resources", "images");
const gcodeDir = path.join(root_path, "server", "resources", "gcodes");
const outputsDir = path.join(root_path, "server", "resources", "outputs");

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
    /**
     * Synchronously, Verify if a given gcode file exist or not in the gcode resources directory
     * @param fileName: gcode file name
     */
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
    },
    /**
     * Synchronously, Create a new output directory for send operation.
     * @param dirName: the name of the new directory
     * @returns newPath: [String] path to new directory
     */
    addOutputDirectorySync: (dirName) => {
        const newPath = path.join(outputsDir, dirName);
        fs.mkdirSync(newPath);
        return newPath;
    },
    /**
     * Asynchronously, Create a new output directory for send operation.
     * @param dirName: the name of the new directory
     * @returns newPath: [String] path to new directory
     */
    addOutputDirectory: (dirName) => {
        const newPath = path.join(outputsDir, dirName);
        return new Promise((resolve, reject) => {
            fs.mkdir(newPath, (error) => {
                if (error) reject(error);
                resolve(newPath);
            });
        });
    },
    /**
     * Synchronously, logging a message into a log file
     * @param dirName: directory name to create a logging file
     * @param content: the content of the logging message
     * @returns [String] the path of the log file
     * @returns [false] if there was an error while appending data to file
     */
    logMessage: (dirName, content) => {
        const t = new Date();
        const logPath = path.join(dirName, t.getTime + ".log");
        try {
            fs.appendFileSync(
                logPath,
                "[" + t.getHours() + ":" + t.getMinutes() + ":" + t.getSeconds() + "." + t.getMilliseconds() + "] : " + content + "\n"
            );
            return logPath;
        } catch (error) {
            console.log('logMessage error :', error);
            return false;
        }

    },
    /**
     * Synchronously, write a line of comment to comments file of a specific gcode file
     * @param dirName: directory name to create a logging file
     * @param fileName: name of the source gcode file
     * @param content: the content of the comment
     * @returns [String] the path of comments file
     * @returns [false] if there was an error while appending data to file
     */
    writeGcodeCommentLine: (dirName, fileName, comment) => {
        const commentFilePath = path.join(dirName, `${fileName}_comments.txt`);
        try {
            fs.appendFileSync(commentFilePath, comment + "\n");
            return commentFilePath;
        } catch (error) {
            console.log('writeGcodeCommentLine error :', error);
            return false;
        }
    },
    /**
     * Synchronously, write a line of gcode of a specific gcode file, without comments
     * @Note this will append for each line the number of characters of that line as a comment
     * @param dirName: directory name to create clean gcode file
     * @param fileName: name of the source gcode file
     * @param line: the content of the gcode line
     * @param charsCount: number of characters of the line, including "\r"
     * @returns [String] the path of clean gcode file
     * @returns [false] if there was an error while appending data to file
     */
    writeCleanGcodeLine: (dirName, fileName, line, charsCount) => {
        const cleanCodePath = path.join(dirName, `${fileName}_clean.gcode`);
        try {
            fs.appendFileSync(
                cleanCodePath,
                `${line} ;| chars count is ${charsCount}\n`
            );
            return cleanCodePath;
        } catch (error) {
            console.log('writeCleanGcodeLine error :', error);
            return false;
        }

    },
    /**
     * Used only for readline function is transmitter controller
     */
    createGcodeFileReadStream: async (fileName) => {
        const filePath = path.join(gcodeDir, fileName);
        await gCodeFileExist(filePath)
            .then((result) => {
                return fs.createReadStream(filePath);
            }).catch((error) => {
                console.log("createGcodeFileReadStream error: "+error);
                return error;
            });
    }
};