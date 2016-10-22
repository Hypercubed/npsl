#!/usr/bin/env node
'use strict';

const debug = require('debug')('listr-cli');
const meow = require('meow');
const findUp = require('find-up');

const {runScript} = require('./');

const cli = meow(`tbd`, {});

debug('Debugging enabled');

cli.path = cli.config ||
  findUp.sync('package-scripts.js') ||
  findUp.sync('package-scripts.json') ||
  findUp.sync('package-scripts.yml');

runScript(cli, cli.input[0]);
