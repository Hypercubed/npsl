'use strict';

const Listr = require('listr');

const {readScriptFile, findTasks} = require('./lib/find-task');
const {convertTask} = require('./lib/convert-task');

function runScripts(options, scriptNames = ['default']) {
  scriptNames = Array.isArray(scriptNames) ? scriptNames : [scriptNames];

  try {
    const scripts = readScriptFile(options.path);
    const tasks = findTasks(scripts, scriptNames, convertTask);
    const listr = new Listr(tasks, options);
    return listr.run().then(() => tasks);
  } catch (err) {
    return Promise.reject(err);
  }
}

module.exports = {
  runScripts
};
