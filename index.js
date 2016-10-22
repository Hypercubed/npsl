'use strict';
const {readFileSync} = require('fs');

const execa = require('execa');
const Listr = require('listr');
const {safeLoad} = require('js-yaml');
const {isPlainObject} = require('lodash');

const {requireDefaultFromModule, getScriptToRun} = require('./lib/utils');

function prepareTask(input, title) {
  const script = isPlainObject(input) ?
    Object.assign({}, input) :
    {task: input};

  script.task = script.task || script.script || script.default || function () {};

  if (typeof script.task === 'function') {
    script.title = script.title || title || script.task.name || 'unnamed';
    return script;
  }

  if (typeof script.task === 'string') {
    const cmd = script.task;
    script.title = script.title || title || cmd;
    script.task = () => execa.shell(cmd).then(({stdout, stderr}) => {
      Object.assign(script, {script: cmd, stdout, stderr});
    });
    return script;
  }

  if (Array.isArray(script.task)) {
    const arr = script.task.slice();
    script.title = script.title || title || 'unnamed';
    script.task = () => {
      script.subtasks = arr.map(s => prepareTask(s));
      return new Listr(script.subtasks);
    };
    return script;
  }

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

function getTasks(config, title = 'default') {
  const scripts = readScriptFile(config.path);
  const script = getScriptToRun(scripts, title);
  const preparedScript = prepareTask(script, title);

  // todo: catch missing script
  return [preparedScript];
}

// return promise
function runScript(options, scriptName) {
  const tasks = getTasks(options, scriptName);

  // TODO: check error?
  const listr = new Listr(tasks, options);
  return listr.run().then(() => tasks);
}

module.exports = {
  runScript
};
