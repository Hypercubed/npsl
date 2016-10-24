#!/usr/bin/env node
'use strict';

const execa = require('execa');

// from https://github.com/sindresorhus/np/blob/master/lib/git.js
execa.stdout('git', ['rev-list', '--count', '--left-only', '@{u}...HEAD']).then(result => {
  if (result !== '0') {
    console.error('Remote history differs. Please pull changes.');
    process.exit(1);
  }
});
