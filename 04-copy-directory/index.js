const path = require('node:path');
const fs = require('node:fs/promises');

const dirPathInput = path.join(__dirname, 'files');
const dirPathOutput = path.join(__dirname, 'files-copy');

async function clearDirectory(dirPathOutput) {
  const files = await fs.readdir(dirPathOutput);
  const olderFiles = files.map((file) => {
    const filePath = path.join(dirPathOutput, file);
    return fs.unlink(filePath);
  });
  return Promise.all(olderFiles);
}
async function getDirForCopy() {
  try {
    await fs.stat(dirPathOutput);
    console.log('folder has been');
    await clearDirectory(dirPathOutput);
  } catch {
    console.log('new folder created');
    fs.mkdir(path.join(__dirname, 'files-copy'), {
      recursive: true,
    });
  }
  return fs.readdir(dirPathInput);
}

getDirForCopy()
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
