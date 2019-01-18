
const combine = (a, b) =>
  (a === '' ? '' : a + ', ') +
  (b === null || b === undefined ? 'null' : b);

const runnerTemplate = {
  preTest: (name, targetFilePath) => {
    return `
const describe = require('./riteway').describe;
const ${name} = require('${targetFilePath}');

const a = describe('${name}', async assert => {`;
  },

  postTest: () => `
});

module.exports = new Promise((resolve, reject) => {
  a.on('end', resolve);
  a.on('error', reject);
});
`,

  test: (name, given, should, actual, expected) => {
  return `  assert({
    given: [${given.reduce(combine, '')}],
    should: '${should}',
    actual: ${name}(${given.reduce(combine, '')}),
    expected: ${typeof expected === 'string' ? `'${expected}'` : expected}
  });

`;
  }
};

const testTemplate = {
  preTest: (name, targetFilePath) => {
    const parts = targetFilePath.split('/');
    return `
const describe = require('riteway').describe;
const ${name} = require('./${parts[parts.length - 1].split('.js')[0]}');

describe('${name}', async assert => {`;
  },

  postTest: () => '});',

  test: runnerTemplate.test
}

class TestGenerator {
  constructor() {

  }

  generateRunnerFile (name, targetFilePath, tests) {
    return `${runnerTemplate.preTest(name, targetFilePath)}
${
  tests
  .map(t =>
    runnerTemplate.test(name, t.given, t.should, t.actual, t.expected)
  ).join('\n')
}
${runnerTemplate.postTest()}
`;
  }

  generateTestFile (name, targetFilePath, tests) {
    return `${testTemplate.preTest(name, targetFilePath)}
${
  tests
  .map(t =>
    testTemplate.test(name, t.given, t.should, t.actual, t.expected)
  ).join('')
}${testTemplate.postTest()}
`;
  }
}

module.exports = TestGenerator;
