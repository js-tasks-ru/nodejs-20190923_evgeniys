function sum(a, b) {
  if (Number.isNaN(Number.parseInt(a)) || Number.isNaN(Number.parseInt(b))) {
    throw new TypeError('Type Error');
  }

  return a + b;
}

module.exports = sum;
