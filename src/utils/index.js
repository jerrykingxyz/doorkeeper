const isObject = function (obj) {
  return typeof obj === 'object' && obj !== null;
};

module.exports = { isObject };