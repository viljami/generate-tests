
const fs = require('fs');

if (!global.lineCounter) {
  global.lineCounter = {};
}

const rootDir = process.cwd();
const tmpDir = rootDir + '/.tmp';
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir);
}

const template = {
  preContent: (filePath) => {
    return `
const isPos = a => a >= 0;
const countVisited = (a, i) => a < 1 ? -1 : i + 1;
const countNotVisited = (a, i) => a > 0 ? -1 : i + 1;

function visited(lineNumber) {
  const lines = global.lineCounter['${filePath}'].lines;
  lines[lineNumber]++;

  global.lineCounter['${filePath}'].visited = lines
  .map(countVisited)
  .filter(isPos);

  global.lineCounter['${filePath}'].notVisited = lines
  .map(countNotVisited)
  .filter(isPos);
}
`;
  },

  processRow: (line, i) => `visited(${i}); ${line}`,

  postContent: () => ''
};

class LineCounter {
  constructor(filePath, file) {
    const parts = filePath.split('/');
    const name = parts[parts.length - 1].replace('.js', '-counted.js');
    this.countedFilePath = tmpDir + '/' + name;
    this.filePath = filePath;
    this.file = file;
    this.rowCount = file.split('\n').length;
    this._stats = {
      lines: new Int32Array(this.rowCount),
      visited: [],
      notVisited: [],
      rowCount: this.rowCount
    };
    this.stats = {
      lines: new Int32Array(this.rowCount),
      visited: [],
      notVisited: [],
      rowCount: this.rowCount
    };
    global.lineCounter[this.filePath] = this.stats;
    this.reset();
    this.countedFile = this.addCounting(file);
  }

  addCounting(file) {
    const rows = file.split('\n');
    return template.preContent(this.filePath) +
    rows
    .map(template.processRow)
    .join('\n') +
    template.postContent(rows.length, file);
  }

  save() {
    this._stats.lines = this.stats.lines.slice();
    this._stats.visited = this.stats.visited.slice();
    this._stats.notVisited = this.stats.notVisited.slice();
  }

  restore() {
    this.stats.lines = this._stats.lines;
    this.stats.visited = this._stats.visited;
    this.stats.notVisited = this._stats.notVisited;
  }

  reset() {
    this.stats.lines.fill(0);
  }
}

module.exports = LineCounter;
