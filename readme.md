# npsl (working title)

> aka npm-package-scripts-listr or npsl for short

** demo only **

## Usage

### install

** not yet **

### package-scripts.yml

```
test:
  default:
  - xo
  - jest
  update: jest -u
  prepublish:
  - del node_modules
  - yarn install
  - xo
  - jest
lint: xo
version:
- chg release -y
- git add -A CHANGELOG.md
postpublish:
- git push --folow-tags
```

### cli

```sh
npsl test.prepublish
```

[![asciicast](https://asciinema.org/a/786o8mz84breb80w4oxvhg4le.png)](https://asciinema.org/a/786o8mz84breb80w4oxvhg4le)

# Inspiration

This package was inspired by [sindresorhus/np](https://github.com/sindresorhus/np) and heavily influenced by [kentcdodds/p-s](https://github.com/kentcdodds/p-s).

# License

MIT
