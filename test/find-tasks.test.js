/* global test, expect, describe */
import {findTasks} from '../lib/find-task';

const {scripts} = require('./fixtures/package-scripts.js');

/*
{
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
*/

describe('find-task', () => {
  test('default task', () => {
    expect(findTasks(scripts)).toEqual(['echo default script']);
  });

  test('top level', () => {
    expect(findTasks(scripts, 'test')).toEqual(['echo test script']);
  });

  test('top level - short', () => {
    expect(findTasks(scripts, 't')).toEqual(['echo test script']);
  });

  test('top level - object', () => {
    expect(findTasks(scripts, 'hello')).toEqual([scripts.hello]);
  });

  test('nested default', () => {
    expect(findTasks(scripts, 'lint')).toEqual([scripts.lint]);
  });

  test('nested', () => {
    expect(findTasks(scripts, 'lint.sub.thing')).toEqual(['echo deeply nested thing']);
  });

  test('nested - short', () => {
    expect(findTasks(scripts, 'l.s.t')).toEqual(['echo deeply nested thing']);
  });

  test('multiple', () => {
    expect(findTasks(scripts, ['test', 'lint.sub.thing']))
      .toEqual(['echo test script', 'echo deeply nested thing']);
  });
});
