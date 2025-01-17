const fs = require('node:fs');
const path = require('node:path');
const { stdout, stderr } = process;
// __dirname путь к папке
// '..' если использовать в пути то на папку назад
const getPathLocal = path.join(__dirname, 'text.txt');

const readingTxT = fs.createReadStream(getPathLocal);

let valuereadFile = '';
async function readFileText(readoble) {
  readoble.setEncoding('utf8');
  for await (const piece of readoble) {
    valuereadFile += piece;
  }
  return valuereadFile;
}
readFileText(readingTxT)
  .then((valuereadFile) => {
    stdout._write(valuereadFile + '\nThis text from text.file');
  })
  .catch(() => stderr._write('Error in read file'));
