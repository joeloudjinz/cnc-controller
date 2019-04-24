const fs = require("fs-extra");
// const fse = require("fs-extra");
const path = require("path");
const root_path = require("app-root-path").path;
const readline = require("readline");

const socketManagerPath = path.join("..", "socket_manager", "controller.js");
const socketManager = require(socketManagerPath);

const imgDir = path.join(root_path, "server", "resources", "images");
const gcodeDir = path.join(root_path, "server", "resources", "gcodes");
const outputsDir = path.join(root_path, "server", "resources", "outputs");

/**
 * used to get the content of a directory by readDirectoryContent promise when the current file is a directory.
 * for outputs directory specifically.
 */
readSubDirectoryContent = dirPath => {
    let obj = {};
    const files = fs.readdirSync(dirPath);
    let i = 0;
    files.forEach(fileName => {
        const filePath = path.join(dirPath, fileName);
        const stats = fs.lstatSync(filePath);
        obj["" + i] = {
            name: fileName,
            type: stats.isDirectory() ? "directory" : "file",
            path: filePath,
            size: stats.size
        };
        i++;
    });
    return obj;
};

module.exports = {
    moveDotGcode: (oldPath, fileName) => {
        return new Promise(async (resolve, reject) => {
            const newPath = path.join(gcodeDir, fileName);
            await fs.rename(oldPath, newPath, error => {
                if (error) {
                    reject(error);
                } else {
                    socketManager.emitGcodeFileAdded({
                        name: fileName,
                        path: newPath
                    });
                    resolve(true);
                }
            });
        });
    },
    moveImage: async (oldPath, fileName) => {
        return new Promise(async (resolve, reject) => {
            const newPath = path.join(imgDir, fileName);
            await fs.rename(oldPath, newPath, error => {
                if (error) {
                    reject(error);
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
                    resolve(false);
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
    deleteGCodeFile: (fileName) => {
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
     * Asynchronously delete an output directory
     * @param dirName directory name
     */
    deleteOutputDirectory(dirName) {
        const newPath = path.join(outputsDir, dirName);
        console.log(newPath);
        return new Promise((resolve, reject) => {
            fs.remove(newPath, (error) => {
                if (error) {
                    console.log(error);
                    reject(error);
                } else
                    resolve(true);
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
     * @returns [String] path to new directory
     * @returns [false] if there was an error while creating directory
     */
    addOutputDirectorySync: (dirName) => {
        const newPath = path.join(outputsDir, dirName);
        try {
            fs.mkdirSync(newPath);
            return newPath;
        } catch (error) {
            console.log('addOutputDirectorySync error :', error);
            return false;
        }
    },
    /**
     * Asynchronously, Create a new output directory for send operation.
     * @param dirName: the name of the new directory
     * @returns [String] path to new directory
     */
    addOutputDirectory: (dirName) => {
        return new Promise((resolve, reject) => {
            if (dirName) {
                const newPath = path.join(outputsDir, dirName);
                fs.mkdir(newPath, (error) => {
                    if (error) reject(error);
                    resolve(newPath);
                });
            } else {
                reject("Directory name is undefined");
            }
        });
    },
    /**
     * Synchronously, logging a message into a log file
     * @param dirName directory name to create a logging file
     * @param fileName the name of .log file
     * @param content the content of the logging message
     * @param doPush either to push data logged to frontend or not
     * @param type of the operation to trigger push content to front-end
     * @returns [true] if executed successfully
     * @returns [false] if there was an error while appending data to file
     */
    logMessage: (dirName, fileName, content, doPush, portName, type) => {
        if (dirName) {
            if (fileName) {
                const logPath = path.join(dirName, fileName + ".log");
                try {
                    const t = new Date();
                    const newContent = "[" + t.getHours() + ":" + t.getMinutes() + ":" + t.getSeconds() + "." + t.getMilliseconds() + "] | " + content;
                    fs.appendFileSync(
                        logPath,
                        newContent + "\n"
                    );
                    if (doPush) {
                        if (type) {
                            switch (type) {
                                case "onData":
                                    if (portName)
                                        socketManager.emitOnPortDataEvent(portName, newContent);
                                    else
                                        console.log("Port name is undefined in logMessage()");
                                    break;
                                case "onLog":
                                    socketManager.emitOnLogDuringTransmissionEvent(newContent);
                                    break;
                                default:
                                    console.log("something is wrong in logMessage(), default case!");
                                    break;
                            }
                        } else {
                            console.log("Operation type is undefined in logMessage()");
                        }
                    }
                    return true;
                } catch (error) {
                    console.log('logMessage error :', error);
                    return false;
                }
            } else {
                return "Log file name is undefined in logMessage()";
            }
        } else {
            return "Directory name is undefined in logMessage()";
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
     * get the full path of gcode file in resources/gcodes directory
     * @param fileName: gcode file name without ext
     * @returns [String] full path to file
     */
    getGcodeFile: (fileName) => {
        return new Promise((resolve, reject) => {
            if (fileName) {
                try {
                    const filePath = path.join(gcodeDir, fileName + ".gcode");
                    fs.access(filePath, fs.constants.F_OK, (error) => {
                        if (error) reject(error.message);
                        else {
                            resolve(filePath);
                        }
                    });
                } catch (error) {
                    reject(error.message);
                }
            } else {
                reject("File name is undefined");
            }
        });
    },
    /**
     * get the full path of image file in resources/images directory
     * @param fileName: full image file name 
     * @returns [String] full path to file
     */
    getImageFile: (fileName) => {
        return new Promise((resolve, reject) => {
            if (fileName) {
                try {
                    const filePath = path.join(imgDir, fileName);
                    fs.access(filePath, fs.constants.F_OK, (error) => {
                        if (error) reject(error.message);
                        else {
                            resolve(filePath);
                        }
                    });
                } catch (error) {
                    reject(error.message);
                }
            } else {
                reject("File name is undefined");
            }
        });
    },
    readDirectoryContent: dirCode => {
        return new Promise((resolve, reject) => {
            let dirPath;
            if (dirCode == 1) {
                dirPath = imgDir;
            } else if (dirCode == 2) {
                dirPath = gcodeDir;
            } else if (dirCode == 3) {
                dirPath = outputsDir;
            } else {
                console.log("Directory code is invalid!");
                reject(new Error("Directory code is invalid!"));
            }
            if (dirPath != undefined) {
                fs.readdir(dirPath, (error, files) => {
                    if (error) {
                        reject(error);
                    } else {
                        let obj = {};
                        let i = 0;
                        files.forEach(async fileName => {
                            const filePath = path.join(dirPath, fileName);
                            const stats = fs.lstatSync(filePath);
                            if (stats.isDirectory()) {
                                const sub = await readSubDirectoryContent(filePath);
                                obj["" + i] = {
                                    name: fileName,
                                    type: "directory",
                                    content: sub
                                };
                            } else {
                                obj["" + i] = {
                                    name: fileName,
                                    type: "file",
                                    path: stats.isDirectory() ? filePath + "/" : filePath,
                                    size: stats.size
                                };
                            }
                            i++;
                        });
                        resolve(obj);
                    }
                });
            } else {
                console.log("Directory path is undefined");
                reject(new Error("Directory code is undefined!"));
            }
        });
    },
    readFileLinsIntoArray: (filePath) => {
        return new Promise((resolve, reject) => {
            let lines = [];
            const gcodeLinesReader = readline.createInterface({
                input: fs.createReadStream(filePath),
                console: false
            });
            gcodeLinesReader.on("line", line => {
                lines.push(line);
            });
            gcodeLinesReader.on("close", () => {
                resolve(lines);
            });
            gcodeLinesReader.on("error", error => {
                reject(error);
            });
        });
    },
    /**
     * used to send images into frontend
     * @param filePath to be read and converted into base64 buffer
     * @returns [Buffer] of a file in base64 encode
     */
    encodeFileIntoBase64: (filePath) => {
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, {
                encoding: 'base64'
            }, function (error, data) {
                if (error) reject(error);
                else {
                    resolve(data);
                }
            });
        });
    }
};