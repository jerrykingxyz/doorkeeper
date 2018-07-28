const path = require('path');
const { isObject } = require('./utils');

/**
 * check whether the object conforms to the format
 * format if the condition is met, otherwise throw an error
 * @param obj
 * @param rules
 */
const checkObject = function (obj, rules) {
  for (const key of Object.keys(rules)) {
    const value = rules[key];
    const objValue = obj[key];
    // check format
    obj[key] = value.format(typeof objValue === 'undefined' ? value.default : objValue);
  }
};

const pluginRules = {
  ext: {
    default: '*',
    format: function (e) {
      // transform to function
      if (typeof e === 'string') {
        return e === '*' ? () => true : ext => ext === e;
      }
      if (Array.isArray(e)) {
        return ext => e.indexOf(ext) !== -1;
      }
      if (typeof e !== 'function') {
        throw new Error('plugin ext format error');
      }

      return e;
    }
  },
  main: {
    format: function (e) {
      if (typeof e !== 'function') {
        throw new Error('plugin main function format error');
      }

      return e;
    }
  }
};

const configRules = {
  input: {
    default: [],
    format: function (e) {
      if (typeof e === 'string') {
        return [ path.resolve(e) ];
      }
      if (!Array.isArray(e)) {
        throw new Error('config input format error');
      }

      return e.map(function (filepath) {
        if (typeof filepath !== 'string') {
          throw new Error('config input item must be string');
        }
        return path.resolve(filepath);
      });
    }
  },
  interactive: {
    default: false,
    format: function (e) {
      return !!e;
    }
  },
  plugins: {
    default: [],
    format: function (e) {
      if (!Array.isArray(e)) {
        throw new Error('config plugins must be a array');
      }

      for(const plugin of e) {
        if (!isObject(plugin)) throw new Error('plugin must be a object');
        checkObject(plugin, pluginRules);
      }

      return e;
    }
  }
};

module.exports = { pluginRules, configRules, checkObject };
