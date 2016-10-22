const gitTasks = require('./scripts/git');

module.exports = {
  test: {
    default: [
      'xo',
      'jest'
    ],
    update: 'jest -u',
    prepublish: [
      {
        title: 'Git',
        script: gitTasks({})
      },
      'del node_modules',
      'yarn install',
      'xo',
      'jest'
    ]
  },
  lint: 'xo',
  version: [
    'chg release -y',
    'git add -A CHANGELOG.md'
  ],
  postpublish: [
    'git push --folow-tags'
  ]
};
