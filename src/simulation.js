const Case = require('./case');
const TestGenerator = require('./test-generator');

class Simulation {
  constructor(filePaths, files, fileLoader) {
    this.files = files;
    this.filePaths = filePaths;
    this.testRunner = new TestGenerator();
    this.cases = files.map((a, i) =>
      new Case(filePaths[i], a, this.testRunner)
    );

    this.readyPromise = Promise.all([fileLoader.save(
      this.cases.map(a => ({
        path: a.lineCounter.countedFilePath,
        content: a.lineCounter.countedFile
      }))
    )].concat(this.cases.map(a => a.readyPromise)));
  }

  async run (duration) {
    return Promise.all(this.cases.map(a => a.run(duration)));
  }
}

module.exports = Simulation;
