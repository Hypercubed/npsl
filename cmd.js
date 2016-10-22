#!/usr/bin/env node
'use strict';
const {join} = require('path');

const debug = require('debug')('listr-cli');
const meow = require('meow');
const findUp = require('find-up');

const {runScript} = require('./');

const cli = meow(`help TBD`, {
  alias: {
    c: 'config'
  }
});

debug('Debugging enabled');

cli.path = join(process.cwd(), cli.flags.config) ||
  findUp.sync('package-scripts.js') ||
  findUp.sync('package-scripts.json') ||
  findUp.sync('package-scripts.yml');

runScript(cli, cli.input[0]);
