#!/usr/bin/env node
'use strict';

const execa = require('execa');

const needBranch = process.argv[2];

// from https://github.com/sindresorhus/np/blob/master/lib/git.js
execa.stdout('git', ['symbolic-ref', '--short', 'HEAD']).then(branch => {
  if (branch !== needBranch) {
    console.error('Not on "%s" branch.', needBranch);
    process.exit(1);
  }
});
