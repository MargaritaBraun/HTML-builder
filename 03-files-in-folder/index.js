const path = require('node:path');
const fs = require('node:fs/promises');

const dirPath = path.join(__dirname, 'secret-folder');

async function getInformationFolder() {
  let information = [];
  try {
    const files = await fs.readdir(dirPath);
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stats = await fs.stat(filePath);
      if (stats.isFile()) {
        const optionsFile = {};
        const { name: fileName, ext: fileExtension } = path.parse(file);
        optionsFile.name = fileName;
        optionsFile.extension = fileExtension.replace('.', '');
        // optionsFile.size = stats.size + ' kb';
        optionsFile.size = (stats.size / 1024).toFixed(3) + ' kb';
        information.push(optionsFile);
      }
    }

    information.forEach((optionsFile) => {
      console.log(
        `${optionsFile.name} - ${optionsFile.extension} - ${optionsFile.size}`,
      );
    });
  } catch (error) {
    console.error(error);
  }
}
getInformationFolder();
