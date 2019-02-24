const fs = require('fs');
const path = require('path');
const root_path = require('app-root-path').path;

const imgDir = path.join(root_path, 'server', 'resources', 'images');
const gcodeDir = path.join(root_path, 'server', 'resources', 'gcodes');

module.exports = {
    moveDotGcode: async (oldPath, fileName) => {
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
                    resolve(true);
                }
            });
        });
    },
}