const path = require('node:path');
const fs = require('node:fs/promises');

const dirPathInput = path.join(__dirname, 'files');
const dirPathOutput = path.join(__dirname, 'files-copy');

const getDirForCopy = fs
  .stat(dirPathOutput)
  .then(() => {
    console.log('folder has been');
    return fs.readdir(dirPathInput);
  })
  .catch(() => {
    console.log('new folder created');
    fs.mkdir(path.join(__dirname, 'files-copy'), {
      recursive: true,
    });
    return fs.readdir(dirPathInput);
  });

getDirForCopy
  .then((files) => {
    const copyedFiles = files.map((file) => {
      const oldPath = path.join(dirPathInput, file);
      const newPath = path.join(dirPathOutput, file);
      return fs.copyFile(oldPath, newPath);
    });
    return Promise.all(copyedFiles);
  })
  .then(() => console.log('all files is copied'))
  .catch((error) => console.error(error));
