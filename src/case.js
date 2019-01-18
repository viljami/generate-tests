const DataAdapter = require('./data-adapter');
const GeneticAI = require('./genetic-ai');
const LineCounter = require('./line-counter');
const Scoring = require('./scoring');

const IS_IF_REGEXP = /(\s|)if\s*\(/;

const requireFromString = async (content, filename) => {
  var Module = module.constructor;
  var m = new Module();
  m._compile(content, filename);
  return m.exports;
}

const countBranching = file =>
  file
  .split('\n')
  .reduce((a, b) => IS_IF_REGEXP.test(b) ? a + 1 : a, 1);

const getName = filePath => {
  const pathParts = filePath.split('.js')[0].split('/');
  const nameParts = pathParts[pathParts.length - 1].split('-');
  return nameParts
  .map((a, i) => i === 0 ? a : a[0].toUpperCase() + a.substr(1))
  .join('');
};

class Case {
  constructor(filePath, file, testGenerator) {
    this.filePath = filePath;
    this.file = file;
    this.testGenerator = testGenerator;
    this.lineCounter = new LineCounter(filePath, file);
    this.scoring = new Scoring();

    this.readyPromise = requireFromString(
      this.file,
      this.filePath
    ).then(api => {
      this.api = api
      this.ai = new GeneticAI(
        this.api.length * 2 + 1,
        countBranching(this.file),
        new DataAdapter(this.api)
      );
    });
  }

  async run(duration) {
    const starTime = Date.now();

    let amplitude = 0.5;
    while (Date.now() - starTime < duration) {
      // 1. Mutate genetics
      const index = Math.floor(Math.random() * this.ai.genes.length);
      const gene = this.ai.genes[index];
      const score = gene.score;
      gene.save();
      gene.mutate(amplitude);
      amplitude -= 0.001;
      if (amplitude < 0.1) amplitude = 0.3;

      // 2. generate tests for the methods
      const result = this.testGenerator
      .generateRunnerFile(
        getName(this.filePath),
        this.lineCounter.countedFilePath,
        gene.read()
      );

      // 3. run generated tests
      try {
        this.lineCounter.save();
        this.lineCounter.reset();
        await requireFromString(result, '.tmp.test.js');

        // 4. Score test results
        gene.score = this.scoring.score(this.lineCounter.stats);
      } catch (e) {
        gene.score = -Infinity;
      }

      // 5. Keep or discards previous tests
      if (gene.score < score) {
        gene.restore();
        gene.score = score;
        this.lineCounter.restore();
      }
    }

    const bestGene = this.ai.genes.reduce((a, b) => a.score > b.score ? a : b, this.ai.genes[0]);

    return {
      path: this.filePath.split('.js').join('.test.js'),
      content: this.testGenerator
        .generateTestFile(getName(this.filePath), this.filePath, bestGene.read())
    };
  }
}

module.exports = Case;
