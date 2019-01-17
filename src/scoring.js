
class Scoring {
  constructor() {

  }

  score(stats) {
    return Math.floor(stats.visited.length * 10000);
  }
}

module.exports = Scoring;
