'use strict';
const {readFileSync} = require('fs');

const execa = require('execa');
const Listr = require('listr');
const {safeLoad} = require('js-yaml');
const {each, cloneDeep, isPlainObject, camelCase, kebabCase} = require('lodash');
const prefixMatches = require('prefix-matches');

function prepareScript(script, title) {
  const task = {};
  if (typeof script === 'string') {
    task.title = title || script;
    task.task = () => execa.shell(script).then(({stdout, stderr}) => {
      Object.assign(task, {stdout, stderr});
    });
    return task;
  }
  if (Array.isArray(script)) {
    task.title = title || 'unnamed';
    task.task = () => {
      task.subtasks = script.map(s => prepareScript(s));
      return new Listr(task.subtasks);
    };
    return task;
  }
  // TODO: functions
  throw new Error(`${typeof script}Not yet supported`);
}

const readScriptFile = configPath => {
  // TODO: catch errors
  const json = configPath.endsWith('.yml') ?
    safeLoad(readFileSync(configPath, 'utf8')) :
    requireDefaultFromModule(configPath);

  // TODO: check for missing scripts
  return json.scripts || json;
};

function getPreparedScript(config, title = 'default') {
  const scripts = readScriptFile(config.path);
  const script = getScriptToRun(scripts, title);
  const preparedScript = prepareScript(script, title);

  // todo: catch missing script
  return [preparedScript];
}

// return promise
function runScript(config, scriptName) {
  const preparedScript = getPreparedScript(config, scriptName);

  // TODO: check error?
  const task = new Listr(preparedScript);
  return task.run().then(() => {
    return preparedScript;
  });
}

module.exports = {
  runScript
};

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
  const scriptString = getScript(defaultlessConfig, input);
  if (scriptString) {
    return scriptString;
  }
  // fallback to the defaults if no other script was found with the given input
  return getScript(config, input) || input; // all else fails return string to run in execa
}

function getScript(config, input) {
  const [script] = prefixMatches(input, config);
  return resolveDefault(script);
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
