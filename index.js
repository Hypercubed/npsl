'use strict';
const {readFileSync} = require('fs');

const execa = require('execa');
const Listr = require('listr');
const {safeLoad} = require('js-yaml');

const {requireDefaultFromModule, getScriptToRun} = require('./lib/utils');

function prepareScript(script, title) {
  const task = {};
  if (typeof script === 'string') {
    task.title = title || script;
    task.task = () => execa.shell(script).then(({stdout, stderr}) => {
      Object.assign(task, {stdout, stderr});
    });
    return task;
  }
  if (typeof script === 'function') {
    task.title = title || script.name;
    task.task = script;
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
  throw new Error(`${typeof script} not yet supported`);
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
