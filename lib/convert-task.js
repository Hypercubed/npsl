const {isPlainObject} = require('lodash');
const execa = require('execa');
const Listr = require('listr');

function convertTasks(input, title) {
  const preparedScript = convertTask(input, title);
  return [preparedScript];
}

function convertTask(input, title) {
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
      script.subtasks = arr.map(s => convertTask(s));
      return new Listr(script.subtasks);
    };
    return script;
  }

  throw new Error(`${typeof script} not yet supported`);
}

module.exports = {
  convertTask,
  convertTasks
};
