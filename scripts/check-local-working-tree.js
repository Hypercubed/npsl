#!/usr/bin/env node
'use strict';

const execa = require('execa');

// from https://github.com/sindresorhus/np/blob/master/lib/git.js
execa.stdout('git', ['status', '--porcelain']).then(status => {
  if (status !== '') {
    console.error('Unclean working tree. Commit or stash changes first.');
    process.exit(1);
  }
});
