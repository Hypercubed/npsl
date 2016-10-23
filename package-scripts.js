const gitTasks = require('./scripts/git');

module.exports = {
  test: {
    default: [
      'xo',
      'jest'
    ],
    update: 'jest -u'
  },
  publish: {
    title: 'prepublish',
    script: [
      {
        title: 'Git',
        script: gitTasks({})
      }, {
        title: 'Test',
        script: [
          'del node_modules',
          'yarn install',
          'xo',
          'jest'
        ]
      },
      'git push origin dev --tags'
    ]
  },
  lint: 'xo',
  version: [
    'chg release -y',
    'git add -A CHANGELOG.md'
  ]
};
