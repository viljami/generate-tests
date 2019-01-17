
const Gene = require('./gene');

class GeneticAI {
  constructor(argumentsLength, branches, adapter) {
    this.genes = [
      new Gene(argumentsLength, branches, adapter),
      new Gene(argumentsLength, branches, adapter),
      new Gene(argumentsLength, branches, adapter)
    ];
  }
}

module.exports = GeneticAI;
