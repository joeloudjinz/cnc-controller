const fs = require('fs');
const path = require('path');
const root_path = require('app-root-path');

const imgDir = path.join(root_path, 'server', 'resources', 'images');
const gcodeDir = path.join(root_path, 'server', 'resources', 'gcodes');

// const imgNamePlusExt = req.file.filename;
// const newPath = root_path + '/server/resources/images/' + imgNamePlusExt;

module.exports = {
    moveDotGcode: async (oldPath, fileName) => {
        return new Promise(async (resolve, reject) => {
            await fs.rename(oldPath, gcodeDir + fileName, async (err) => {
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
            await fs.rename(oldPath, imgDir + fileName, async (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        });
    },
    // deleteGcode: async (fileName, )
}