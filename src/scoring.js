
class Scoring {
  constructor() {

  }

  score(stats) {
    return stats.visited.length * 10000;
  }
}

module.exports = Scoring;
