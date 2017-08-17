# egg-zookeeper

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![NPM download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-zookeeper.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-zookeeper
[travis-image]: https://img.shields.io/travis/node-modules/egg-zookeeper.svg?style=flat-square
[travis-url]: https://travis-ci.org/node-modules/egg-zookeeper
[codecov-image]: https://codecov.io/gh/node-modules/egg-zookeeper/branch/master/graph/badge.svg
[codecov-url]: https://codecov.io/gh/node-modules/egg-zookeeper
[david-image]: https://img.shields.io/david/node-modules/egg-zookeeper.svg?style=flat-square
[david-url]: https://david-dm.org/node-modules/egg-zookeeper
[snyk-image]: https://snyk.io/test/npm/egg-zookeeper/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/egg-zookeeper
[download-image]: https://img.shields.io/npm/dm/egg-zookeeper.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-zookeeper

egg plugin for zookeeper

## Install

```bash
npm i egg-zookeeper --save
```

## Usage

1. Install & enable the plugin in egg

```js
// config/plugin.js
exports.zookeeper = {
  enable: true,
  package: 'egg-zookeeper',	
};
```

2. Create zk client with `app.zk.createClient(connectionString)` api

```js

const client = app.zk.createClient('localhost:2181');
yield client.ready();

const path = '/test-path';

function listChildren(client, path) {
  client.getChildren(
    path,
    event => {
      console.log('Got watcher event: %s', event);
      listChildren(client, path);
    },
    (err, children, stat) => {
      if (err) {
        console.log('Failed to list children of %s due to: %s.', path, err);
        return;
      }
      console.log('Children of %s are: %j.', path, children);
    }
  );
}

// create a new path
client.create(path, err => {
  if (err) {
    console.log('Failed to create node: %s due to: %s.', path, err);
  } else {
    console.log('Node: %s is successfully created.', path);
  }

  // list and watch the children of given node
  listChildren();
});
```

## APIs

Please refer to [zookeeper-cluster-client](https://www.npmjs.com/package/zookeeper-cluster-client) in detail.

## License

[MIT](LICENSE.txt)
