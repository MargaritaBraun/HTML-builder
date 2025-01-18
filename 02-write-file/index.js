const path = require('node:path');
const fs = require('node:fs');
// stderr,
const { stdout, stdin, stderr } = process;

const readline = require('node:readline').createInterface({
  input: stdin,
  output: stdout,
});

const localPath = path.join(__dirname, 'text.txt');

// const writeStream = fs.createWriteStream(localPath, { flags: 'a' });

// function writeText(text) {
//   writeStream.write(`${text}\n`);
//   readline.prompt();
// }
// writeStream.write('Hello, World!\n');

readline.setPrompt('Please enter text: ');
readline.prompt();
readline.on('line', (input) => {
  if (input.trim().toLowerCase() === '.exit') {
    readline.close();
  } else {
    fs.appendFile(localPath, `${input}\n`, (err) => {
      if (err) {
        stderr.write('Error in write file');
      }
    });
  }
});

readline.on('close', () => {
  //   writeStream.end();
  stdout.write('Goodbye!\n');
});
