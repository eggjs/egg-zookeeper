'use strict';


/**
 * zookeeper default config
 * @member Config#zookeeper
 * @property {String} connectionString - Comma separated `host:port` pairs, each represents a ZooKeeper server. You can optionally append a chroot path, then the client would be rooted at the given path. e.g. `localhost:3000,locahost:3001,localhost:3002`, `localhost:2181,localhost:2182/test`
 * @property {Number|String} sessionTimeout - Session timeout in milliseconds, defaults to 30 seconds.
 * @property {Number|String} spinDelay - The delay (in milliseconds) between each connection attempts.
 * @property {Number|String} retries - The number of retry attempts for connection loss exception.
 */
exports.zookeeper = {
  connectionString: 'localhost:2181',
  sessionTimeout: 30000,
  spinDelay: 1000,
  retries: 100,
};
