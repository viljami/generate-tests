
const fs = require('fs');

async function read(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => err ? reject(err) : resolve(data));
  });
}

async function write(file, text) {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, text, err => err ? reject(err) : resolve());
  });
}

class FileLoader {
  constructor() {

  }

  async load(filePaths) {
    return Promise.all(filePaths.map(read));
  }

  async save(files) {
    console.log('Saving tests:', files.map(a => a.path));
    return Promise.all(files.map(a => {
      return write(a.path, a.content);
    }));
  }
}

module.exports = FileLoader;
