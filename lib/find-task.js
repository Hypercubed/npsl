const {readFileSync} = require('fs');
// const assert = require('assert');

const {each, cloneDeep, isPlainObject, camelCase, kebabCase} = require('lodash');
const prefixMatches = require('prefix-matches');
const {safeLoad} = require('js-yaml');
const ono = require('ono');

function readScriptFile(configPath) {
  // TODO: catch errors
  let json;
  try {
    json = configPath.endsWith('.yml') ?
      safeLoad(readFileSync(configPath, 'utf8')) :
      requireDefaultFromModule(configPath);
  } catch (err) {
    throw ono('Unable to find JS config at "%s', configPath);
  }

  // TODO: check for missing scripts
  return json.scripts || json;
}

// All these are borrowed from https://github.com/kentcdodds/p-s/blob/
function requireDefaultFromModule(modulePath) {
  const mod = require(modulePath); // eslint-disable-line import/no-dynamic-require
  if (mod.__esModule) {
    return mod.default;
  }
  return mod;
}

function findTasks(config, input = ['default'], fn = _ => _) {
  input = Array.isArray(input) ? input : [input];
  config = kebabAndCamelCasify(config);

  const defaultlessConfig = removeDefaults(cloneDeep(config));
  const findTask = scriptName =>
    resolveDefault(prefixMatches(scriptName, defaultlessConfig)[0]) || // find excluding defaults
    prefixMatches(scriptName, config)[0] ||                            // find including defaults
    scriptName;                                                        // last resort

  return input
    .map(scriptName => fn(findTask(scriptName), scriptName));
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
  findTasks,
  readScriptFile
};
