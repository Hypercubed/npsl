module.exports = {
  scripts: {
    default: 'echo "default script"',
    test: 'echo "test script"',
    check: ['echo "test script"', 'echo "lint.default"'],
    lint: {
      default: 'echo "lint.default"',
      sub: {
        thing: {
          description: 'this is a description',
          script: 'echo "deeply nested thing"'
        },
        hiddenThing: {
          hiddenFromHelp: true,
          script: 'echo "hidden"'
        }
      }
    }
  }
};
