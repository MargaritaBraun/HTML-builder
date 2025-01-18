const path = require('node:path');
const fs = require('node:fs/promises');

const dirPathInput = path.join(__dirname, 'styles');
// const dirPathOutput = path.join(__dirname, 'project-dist');
const fileForBuild = path.join(__dirname, 'project-dist', 'bundle.css');

const fileForMerge = fs
  .stat(dirPathInput)
  .then(() => {
    return fs.readdir(dirPathInput);
  })
  .catch(() => {
    console.error('whai is loose');
  });
fileForMerge
  .then((files) => {
    // console.log(files);
    const onlyFilesCss = files.filter((file) => path.extname(file) === '.css');
    return fs.writeFile(fileForBuild, '').then(() => {
      return onlyFilesCss;
    });
  })
  .then((files) => {
    const result = files.map((file) => {
      //   console.log('one', file);
      const oldPath = path.join(dirPathInput, file);
      return fs
        .readFile(oldPath, 'utf8')
        .then((data) => fs.appendFile(fileForBuild, data));
    });
    return Promise.all(result);
  })
  .then(() => console.log('all files is copied'))
  .catch((error) => console.error(error));
