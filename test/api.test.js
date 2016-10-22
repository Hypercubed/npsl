/* global test, expect, describe */
import {resolve, join} from 'path';
import {runScript} from '../';

const fixturesPath = resolve(__dirname, './fixtures');

describe('javascript', () => {
  const configPath = join(fixturesPath, 'scripts.js');
  test('default task', () => {
    return runScript({path: configPath}).then(res => {
      expect(res).toMatchSnapshot();
    });
  });

  test('simple string task', () => {
    return runScript({path: configPath}, 'test').then(res => {
      expect(res).toMatchSnapshot();
    });
  });

  test('task default', () => {
    return runScript({path: configPath}, 'lint').then(res => {
      expect(res).toMatchSnapshot();
    });
  });

  test('deep task', () => {
    return runScript({path: configPath}, 'l.s.t').then(res => {
      expect(res).toMatchSnapshot();
    });
  });

  test('array of tasks', () => {
    return runScript({path: configPath}, 'check').then(res => {
      expect(res).toMatchSnapshot();
    });
  });
});

describe('json', () => {
  const configPath = join(fixturesPath, 'scripts.json');
  test('default task', () => {
    return runScript({path: configPath}).then(res => {
      expect(res).toMatchSnapshot();
    });
  });

  test('simple string task', () => {
    return runScript({path: configPath}, 'test').then(res => {
      expect(res).toMatchSnapshot();
    });
  });

  test('task default', () => {
    return runScript({path: configPath}, 'lint').then(res => {
      expect(res).toMatchSnapshot();
    });
  });

  test('deep task', () => {
    return runScript({path: configPath}, 'l.s.t').then(res => {
      expect(res).toMatchSnapshot();
    });
  });

  test('array of tasks', () => {
    return runScript({path: configPath}, 'check').then(res => {
      expect(res).toMatchSnapshot();
    });
  });
});

describe('yml', () => {
  const configPath = join(fixturesPath, 'scripts.yml');
  test('default task', () => {
    return runScript({path: configPath}).then(res => {
      expect(res).toMatchSnapshot();
    });
  });

  test('simple string task', () => {
    return runScript({path: configPath}, 'test').then(res => {
      expect(res).toMatchSnapshot();
    });
  });

  test('task default', () => {
    return runScript({path: configPath}, 'lint').then(res => {
      expect(res).toMatchSnapshot();
    });
  });

  test('deep task', () => {
    return runScript({path: configPath}, 'l.s.t').then(res => {
      expect(res).toMatchSnapshot();
    });
  });

  test('array of tasks', () => {
    return runScript({path: configPath}, 'check').then(res => {
      expect(res).toMatchSnapshot();
    });
  });
});
