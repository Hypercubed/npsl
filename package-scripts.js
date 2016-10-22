const execa = require('execa');

module.exports = {
  test: {
    default: [
      'xo',
      'jest'
    ],
    update: 'jest -u',
    prepublish: [
      CheckCurrentBranch,
      CheckLocalWorkingTree,
      CheckRemoteHistory,
      'del node_modules',
      'yarn install',
      'xo',
      'jest'
    ]
  },
  something: [CheckCurrentBranch, CheckLocalWorkingTree, CheckRemoteHistory],
  lint: 'xo',
  version: [
    'chg release -y',
    'git add -A CHANGELOG.md'
  ],
  postpublish: [
    'git push --folow-tags'
  ]
};

function CheckCurrentBranch() {
  return execa.stdout('git', ['symbolic-ref', '--short', 'HEAD']).then(branch => {
    if (branch !== 'composition') {
      throw new Error('Not on `master` branch. Use --any-branch to publish anyway.');
    }
  });
}

function CheckLocalWorkingTree() {
  return execa.stdout('git', ['status', '--porcelain']).then(status => {
    if (status !== '') {
      throw new Error('Unclean working tree. Commit or stash changes first.');
    }
  });
}

function CheckRemoteHistory() {
  return execa.stdout('git', ['rev-list', '--count', '--left-only', '@{u}...HEAD']).then(result => {
    if (result !== '0') {
      throw new Error('Remote history differ. Please pull changes.');
    }
  });
}