const execa = require('execa');

const task = {
  title: 'Fun fun fun',
  task: execa.shell('echo Fun fun fun').then(({stdout, stderr}) => {
    Object.assign(task, {stdout, stderr});
  })
};

module.exports = {
  scripts: {
    default: 'echo default script',
    test: 'echo test script',
    check: ['echo test script', 'echo lint.default'],
    fun() {},
    task,
    hello: {
      title: 'Hello World',
      task: 'echo Hello World'
    },
    lint: {
      default: 'echo lint.default',
      sub: {
        thing: {
          description: 'this is a description',
          script: 'echo deeply nested thing'
        },
        hiddenThing: {
          hiddenFromHelp: true,
          script: 'echo hidden'
        }
      }
    }
  }
};
