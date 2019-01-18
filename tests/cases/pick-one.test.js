
const describe = require('riteway').describe;
const pickOne = require('./pick-one');

describe('pickOne', async assert => {
  assert({
    given: [7, null, 'Lorem ipsum dolor est. Gradi a'],
    should: '<fill me>',
    actual: pickOne(7, null, 'Lorem ipsum dolor est. Gradi a'),
    expected: undefined
  });

  assert({
    given: [null, null, 1710.5239629745483],
    should: '<fill me>',
    actual: pickOne(null, null, 1710.5239629745483),
    expected: 1710.5239629745483
  });

  assert({
    given: [true, null, -4917],
    should: '<fill me>',
    actual: pickOne(true, null, -4917),
    expected: true
  });

  assert({
    given: [null, 4, -335.24543046951294],
    should: '<fill me>',
    actual: pickOne(null, 4, -335.24543046951294),
    expected: 4
  });

});
