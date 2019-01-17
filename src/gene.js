
const average = (a, b) => (a + b) / 2;
const random = (n, m) => Math.random() * (m - n) + n;

const mutateOne = (value, amplitude) => {
  let vMin = value - amplitude;
  let vMax = value + amplitude;

  if (vMin < 0.0) {
    vMin = 0.0;
  }

  if (vMax > 1.0) {
    vMax = 1.0;
  }

  return random(vMin, vMax);
};

function Gene (
  dataCount,
  optionCount,
  dataAdapter
) {
  this.dataCount = dataCount;
  this.optionCount = optionCount;
  this.dataLength = dataCount * optionCount;
  this.dataAdapter = dataAdapter;
  this.data = new Float32Array(this.dataLength * 2);
  this.score = -Infinity;
}

Gene.prototype.read = function () {
  return this.dataAdapter.read(
    this.data,
    this.dataCount,
    this.optionCount,
    this.dataLength
  );
};

Gene.prototype.randomize = function() {
  const d = this.data;
  for (let i = 0; i < this.dataLength; i++) {
    d[i] = Math.random();
  }
};

Gene.prototype.mutate = function(amplitude) {
  const d = this.data;
  for (let i = 0; i < this.dataLength; i++) {
    d[i] = mutateOne(d[i], amplitude);
  }
};

Gene.prototype.combine = function(gene) {
  const d1 = this.data;
  const d2 = gene.data;
  for (let i = 0; i < this.dataLength; i++) {
    d1[i] = average(d1[i], d2[i]);
  }
};

Gene.prototype.stepForward = function() {
  this.data.copyWithin(0, this.oneDataLength, this.dataLength - this.oneMoveLength);
};

Gene.prototype.save = function() {
  this.data.copyWithin(this.dataLength, 0, this.dataLength);
};

Gene.prototype.restore = function() {
  this.data.copyWithin(0, this.dataLength);
};

module.exports = Gene;
