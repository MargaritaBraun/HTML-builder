const fs = require('node:fs/promises');
const path = require('node:path');
const { createReadStream } = require('node:fs');
const { createInterface } = require('node:readline');

const directory = __dirname;
const dirPathInputHtml = path.join(directory, 'template.html');

const dirPathInputAssets = path.join(directory, 'assets');
const dirPathOutputAssets = path.join(directory, 'project-dist', 'assets');

const clearDirectory = async (dir) => {
  try {
    await fs.rm(dir, { recursive: true, force: true });
    // console.log(`Directory ${dir} has been deleted.`);
  } catch (error) {
    console.error(`Error deleting directory: ${error}`);
  }
};

const copyFunc = async (src, dest) => {
  await clearDirectory(dest);
  await fs.mkdir(dest, {
    recursive: true,
  });
  // try {
  const files = await fs.readdir(src);
  const copyPromise = files.map(async (file) => {
    const oldPath = path.join(src, file);
    const newPath = path.join(dest, file);
    // await fs.copyFile(oldPath, newPath);
    const stats = await fs.stat(oldPath);
    // .then((stats) => {
    if (stats.isDirectory()) {
      copyFunc(oldPath, newPath);
    } else {
      fs.copyFile(oldPath, newPath);
    }
    // })
  });
  // }
  return Promise.all(copyPromise)
    .then(() => console.log('asset is copied'))
    .catch((error) => console.error(error));
};

copyFunc(dirPathInputAssets, dirPathOutputAssets);

const dirPathInputCss = path.join(__dirname, 'styles');
const dirPathOutputCssFile = path.join(__dirname, 'project-dist', 'style.css');
const buildingCssFunc = async (srcCss, pathToCss) => {
  //   await clearDirectory(dirPathOutputCssFile);
  //   await fs.createWriteStream(pathToCss, {
  //     flags: 'a',
  //   });
  const files = await fs.readdir(srcCss);
  const onlyFilesCss = files.filter((file) => path.extname(file) === '.css');
  await fs.writeFile(pathToCss, '');
  const result = onlyFilesCss.map((file) => {
    const oldPath = path.join(srcCss, file);
    return fs
      .readFile(oldPath, 'utf8')
      .then((data) => fs.appendFile(pathToCss, data));
  });
  return Promise.all(result)
    .then(() => console.log('style is built'))
    .catch((error) => console.error(error));
};

buildingCssFunc(dirPathInputCss, dirPathOutputCssFile);

const puzzle = path.join(directory, 'components');
const dirPathCompiledHtml = path.join(directory, 'project-dist', 'index.html');

const puzzleFunc = async (template, compiledHtml, puzzleCode) => {
  await fs.writeFile(compiledHtml, '');
  const fileStream = createReadStream(template);

  async function getComponents(line) {
    // console.log('line:', line);

    const matches = [...line.matchAll(/{{(.*?)}}/g)];
    const parts = line.split(/{{.*?}}/g);

    for (let i = 0; i < matches.length; i++) {
      const match = matches[i];
      const componentName = match[1].trim();
      //   console.log('component name:', componentName);

      try {
        const componentContent = await fs.readFile(
          path.join(puzzleCode, `${componentName}.html`),
          'utf8',
        );

        if (parts[i].trim() !== '') {
          await fs.appendFile(compiledHtml, parts[i] + '\n');
        }

        await fs.appendFile(compiledHtml, componentContent + '\n');
      } catch (error) {
        console.error(`Error reading component ${componentName}:`, error);
      }
    }

    if (parts[parts.length - 1].trim() !== '') {
      await fs.appendFile(compiledHtml, parts[parts.length - 1] + '\n');
    }
  }

  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    if (line.includes('{{')) {
      await getComponents(line);
    } else {
      await fs.appendFile(compiledHtml, line + '\n');
    }
  }

  console.log('Compiled HTML saved to:', compiledHtml);
};

puzzleFunc(dirPathInputHtml, dirPathCompiledHtml, puzzle);
