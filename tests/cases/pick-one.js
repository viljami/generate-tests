
module.exports = function(a, b, c) {
  let i;
  if (a > b && a > c) {
    i = a;
  }

  if (b > a && b > c) {
    i = b;
  }

  if (c > a && c > b) {
    i = c;
  }

  return i;
};
