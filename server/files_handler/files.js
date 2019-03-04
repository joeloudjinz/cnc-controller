const fs = require('fs');
const path = require('path');
const root_path = require('app-root-path').path;

const imgDir = path.join(root_path, 'server', 'resources', 'images');
const gcodeDir = path.join(root_path, 'server', 'resources', 'gcodes');

module.exports = {
    moveDotGcode: (oldPath, fileName) => {
        return new Promise(async (resolve, reject) => {
            const newPath = path.join(gcodeDir, fileName);
            await fs.rename(oldPath, newPath, (err) => {
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
            await fs.rename(oldPath, newPath, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(newPath);
                }
            });
        });
    },
    getGCodeFileStats: (fileName) => {
        const newPath = path.join(gcodeDir, fileName);
        // console.log(newPath);
        return new Promise((resolve, reject) => {
            fs.access(newPath, async (error) => {
                if (error) {
                    console.log(error);
                    reject('File Does Not Exist');
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
    }
};
// deleteImage: async (filePath) => {

// }