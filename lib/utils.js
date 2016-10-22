const {each, cloneDeep, isPlainObject, camelCase, kebabCase} = require('lodash');
const prefixMatches = require('prefix-matches');

// All these are from https://github.com/kentcdodds/p-s/blob/
function requireDefaultFromModule(modulePath) {
  const mod = require(modulePath); // eslint-disable-line import/no-dynamic-require
  if (mod.__esModule) {
    return mod.default;
  }
  return mod;
}

function getScriptToRun(config, input) {
  config = kebabAndCamelCasify(config);
  // remove the default objects/strings so we can check if the prefix works with another script first
  const defaultlessConfig = removeDefaults(cloneDeep(config));
  const scriptString = getScriptOrUndefined(defaultlessConfig, input);
  if (scriptString) {
    return scriptString;
  }
  // fallback to the defaults if no other script was found with the given input
  return getScript(config, input) || input; // all else fails return string to run in execa
}

function getScriptOrUndefined(config, input) {
  const [script] = prefixMatches(input, config);
  return resolveDefault(script);
}

function getScript(config, input) {
  const [script] = prefixMatches(input, config);
  return resolveDefault(script) || script;
}

function removeDefaults(object) {
  each(object, (value, key) => {
    if (key === 'default') {
      delete object[key];
    } else if (isPlainObject(value)) {
      object[key] = removeDefaults(value);
    }
  });
  return object;
}

function kebabAndCamelCasify(obj) {
  return Object.keys(obj).reduce((result, key) => {
    const camel = camelCase(key);
    const kebab = kebabCase(key);
    let val = obj[key];
    if (isPlainObject(obj[key])) {
      val = kebabAndCamelCasify(val);
    }
    if (key !== camel || key !== kebab) {
      result[camel] = val;
      result[kebab] = val;
    } else {
      result[key] = val;
    }
    return result;
  }, obj);
}

function resolveDefault(script) {
  if (isPlainObject(script)) {
    return script.script || script.default || undefined;
  }
  return script;
}

module.exports = {
  requireDefaultFromModule,
  getScriptToRun
};
