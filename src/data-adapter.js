
const typeConverter = {
  smallInt: n => Math.floor(n * 20) - 10,
  smallUint: n => Math.floor(n * 10),
  int: n => Math.floor(n * 10000) - 5000,
  double: n => n * 10000 - 5000,
  string: n =>
    'Lorem ipsum dolor est. Gradi all.'
    .slice(0, Math.floor(n * 33) + 1),
  bool: n => n < 0.5 ? true : false,
  none: () => null
};

const types = Object.keys(typeConverter);
const FRACTION = 1 / types.length + 0.001;

const getType = n => {
  let counter = 0;
  for (let i = 0; i < 1; i += FRACTION) {
    if (n < i) {
      return types[counter];
    }

    counter++;
  }

  return types[counter - 1];
};

const getValue = (type, n) => {
  return typeConverter[type](n);
};

class DataAdapter {
  constructor (api) {
    this.api = api;
  }

  read(data, dataCount, optionCount, dataLength) {
    const results = [];
    for (let i = 0; i < dataLength; i += dataCount) {
      const isActive = data[i] > 0.3;
      if (isActive) {
        const args = [];
        for (let j = 1; j < dataCount; j += 2) {
          args.push(getValue(getType(data[i + j]), data[i + j + 1]));
        }

        results[i] = {
          given: args.map(a => (typeof a === 'string') ? `'${a}'` : a),
          should: '<fill me>',
          actual: this.api(...args),
          expected: this.api(...args)
        };
      }
    }

    return results;
  }
}

module.exports = DataAdapter;
