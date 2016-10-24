#!/usr/bin/env node
'use strict';
const {join} = require('path');

const debug = require('debug')('listr-cli');
const meow = require('meow');
const findUp = require('find-up');

const {runScripts} = require('./');

const cli = meow(`
  Usage
	  $ npsl <task>

  Options:

    -h, --help
    -V, --version
    -p, --path <filepath>     Path to scripts file (defaults to nearest package-scripts.{js,json,yml}).
    -c, --concurrent          Run tasks concurrently.
    -r, --renderer            Renderer that should be used (default, verbose, silent)
`, {
  alias: {
    c: 'concurrent',
    p: 'path',
    r: 'renderer',
    h: 'help',
    V: 'version'
  }
});

debug('Debugging enabled');

cli.flags.path = cli.flags.path ?
  join(process.cwd(), cli.flags.path) :
  findUp.sync('package-scripts.js') ||
  findUp.sync('package-scripts.json') ||
  findUp.sync('package-scripts.yml');

if (!cli.flags.path) {
  console.error('Unable to find a config file.'); // eslint-disable-line no-console
  process.exit(1);
}

runScripts(cli.flags, cli.input)
  .catch(err => {
    console.error(`\n${err.message}`); // eslint-disable-line no-console
    process.exit(1);
  });
