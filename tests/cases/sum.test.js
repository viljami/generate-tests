
const describe = require('riteway').describe;
const sum = require('./sum');

describe('sum', async assert => {
  assert({
    given: [null, -257.6613426208496],
    should: '<fill me>',
    actual: sum(null, -257.6613426208496),
    expected: -257.6613426208496
  });

});
