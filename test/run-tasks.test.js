/* global test, expect, describe */
import {resolve, join} from 'path';
import {runScripts} from '../';

const fixturesPath = resolve(__dirname, './fixtures');
const renderer = 'silent';

describe('javascript', () => {
  const path = join(fixturesPath, 'package-scripts.js');
  test('default task', () => {
    return runScripts({path, renderer}).then(res => {
      expect(res).toMatchSnapshot();
    });
  });

  test('simple string task', () => {
    return runScripts({path, renderer}, 'test').then(res => {
      expect(res).toMatchSnapshot();
    });
  });

  test('task default', () => {
    return runScripts({path, renderer}, 'lint').then(res => {
      expect(res).toMatchSnapshot();
    });
  });

  test('deep task', () => {
    return runScripts({path, renderer}, 'l.s.t').then(res => {
      expect(res).toMatchSnapshot();
    });
  });

  test('array of tasks', () => {
    return runScripts({path, renderer}, 'check').then(res => {
      expect(res).toMatchSnapshot();
    });
  });

  test('function task', () => {
    return runScripts({path, renderer}, 'fun').then(res => {
      expect(res).toMatchSnapshot();
    });
  });

  test('task with title', () => {
    return runScripts({path, renderer}, 'hello').then(res => {
      expect(res).toMatchSnapshot();
    });
  });

  test('multiple tasks', () => {
    return runScripts({path, renderer}, ['test', 'hello']).then(res => {
      expect(res).toMatchSnapshot();
    });
  });
});

describe('json', () => {
  const path = join(fixturesPath, 'package-scripts.json');
  test('default task', () => {
    return runScripts({path, renderer}).then(res => {
      expect(res).toMatchSnapshot();
    });
  });

  test('simple string task', () => {
    return runScripts({path, renderer}, 'test').then(res => {
      expect(res).toMatchSnapshot();
    });
  });

  test('task default', () => {
    return runScripts({path, renderer}, 'lint').then(res => {
      expect(res).toMatchSnapshot();
    });
  });

  test('deep task', () => {
    return runScripts({path, renderer}, 'l.s.t').then(res => {
      expect(res).toMatchSnapshot();
    });
  });

  test('array of tasks', () => {
    return runScripts({path, renderer}, 'check').then(res => {
      expect(res).toMatchSnapshot();
    });
  });

  test('task with title', () => {
    return runScripts({path, renderer}, 'hello').then(res => {
      expect(res).toMatchSnapshot();
    });
  });
});

describe('yml', () => {
  const path = join(fixturesPath, 'package-scripts.yml');
  test('default task', () => {
    return runScripts({path, renderer}).then(res => {
      expect(res).toMatchSnapshot();
    });
  });

  test('simple string task', () => {
    return runScripts({path, renderer}, 'test').then(res => {
      expect(res).toMatchSnapshot();
    });
  });

  test('task default', () => {
    return runScripts({path, renderer}, 'lint').then(res => {
      expect(res).toMatchSnapshot();
    });
  });

  test('deep task', () => {
    return runScripts({path, renderer}, 'l.s.t').then(res => {
      expect(res).toMatchSnapshot();
    });
  });

  test('array of tasks', () => {
    return runScripts({path, renderer}, 'check').then(res => {
      expect(res).toMatchSnapshot();
    });
  });

  test('task with title', () => {
    return runScripts({path, renderer}, 'hello').then(res => {
      expect(res).toMatchSnapshot();
    });
  });
});
