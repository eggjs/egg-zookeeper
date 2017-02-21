'use strict';

const assert = require('assert');
const utils = require('./utils');
const Base = require('sdk-base');
const consts = require('./consts');
const zk = require('node-zookeeper-client');
const ACL = require('./classes/acl');

const watchTypeToFnMap = {
  data: 'getData',
  existence: 'exists',
  children: 'getChildren',
};


class ZooKeeperRealClient extends Base {
  constructor(options) {
    super(options);
    assert(options.connectionString, 'options.connectionString is required');
    assert(options.sessionTimeout, 'options.sessionTimeout is required');
    assert(options.spinDelay, 'options.spinDelay is required');
    assert(options.retries, 'options.retries is required');
    this._options = options;

    const client = this._client = zk.createClient(options.connectionString, options);
    utils.delegateEvents(this._client, this, consts.events);
    this.once('connected', () => this.ready(true));
    client.connect();
  }

  /**
   * Create a node with given path, data, acls and mode.
   * @param {String} path - Path of the node.
   * @param {Object} [options] - Options for create.
   * @param {Buffer|String} [options.data=null] - The data buffer.
   * @param {Array} [options.acls=ACL.OPEN_ACL_UNSAFE] - An array of ACL objects.
   * @param {CreateMode} [options.mode=CreateMode.PERSISTENT] - The creation mode.
   * @return {String} Returns the created node path.
   */
  * create(path, options = {}) {
    if (options.data && !Buffer.isBuffer(options.data)) {
      options.data = Buffer.from(options.data, options);
    }

    return yield callback => this._client.create(path, options.data, options.acls, options.mode, callback);
  }

  /**
   * Delete a node with the given path and version.
   * @param {String} path - Path of the node.
   * @param {Object} [options] - Options for remove.
   * @param {Number} [options.version=-1] - The version of the node. If version is provided and not equal to -1, the request will fail when the provided version does not match the server version.
   */
  * remove(path, options = {}) {
    if (options.version === undefined) {
      options.version = -1;
    }

    yield callback => this._client.remove(path, options.version, callback);
  }

  /**
   * Check the existence of a node.
   * @param {String} path - Path of the node.
   * @return {*} Returns the state of the given path, or null if no such node exists.
   */
  * exists(path) {
    return yield callback => this._client.exists(path, callback);
  }

  /**
   * For the given node path, retrieve the children list and the stat. The children will be an unordered list of strings.
   * @param {String} path - Path of the node.
   * @return {Object} Returns an object like `{ children, stat }`, the `children` is an array of strings and the `stat` is an instance of Stat.
   */
  * getChildren(path) {
    return yield callback => this._client.getChildren(path, (err, children, stat) => callback(err, { children, stat }));
  }

  /**
   * Retrieve the data and the stat of the node of the given path.
   * @param {String} path - Path of the node.
   * @return {Object} Returns an object like `{ data, stat }`. The `data` is an instance of Buffer and `stat` is an instance of Stat.
   */
  * getData(path) {
    return yield callback => this._client.getData(path, (err, data, stat) => callback(err, { data, stat }));
  }

  /**
   * Set the data for the node of the given path if such a node exists and the optional given version matches the version of the node.
   * @param {String} path - Path of the node.
   * @param {Buffer|String} data - The data buffer.
   * @param {Object} [options] - Options for setData.
   * @param {Number} [options.version=-1] - If the given version is -1, it matches any node's versions.
   * @return {Stat} Returns the stat of the node.
   */
  * setData(path, data, options = {}) {
    if (data && !Buffer.isBuffer(data)) {
      data = Buffer.from(data, options);
    }

    if (options.version === undefined) {
      options.version = -1;
    }

    return yield callback => this._client.setData(path, data, options.version, callback);
  }

  /**
   * Retrieve the list of ACL and stat of the node of the given path.
   * @param {String} path - Path of the node.
   * @return {Object} Returns an object like `{ acls, stat }`. `acls` is an array of ACL instances. The `stat` is an instance of Stat.
   */
  * getACL(path) {
    return yield callback => this._client.getACL(path, (err, acls, stat) => callback(err, { acls, stat }));
  }

  /**
   * Set the ACL for the node of the given path if such a node exists and the given version (optional) matches the version of the node on the server.
   * @param {String} path - Path of the node.
   * @param {Array} acls - An array of ACL instances.
   * @param {Object} [options] - Options for setACL.
   * @param {Number} [options.version=-1] - The version of the node. If the given version is -1, it matches any versions
   * @return {Stat} Returns the stat of the node.
   */
  * setACL(path, acls, options = {}) {
    if (options.version === undefined) {
      options.version = -1;
    }

    if (!Array.isArray(acls)) {
      acls = [ acls ];
    }

    acls = acls.map(ACL.decode);
    console.log('acls', acls);

    return yield callback => this._client.setACL(path, acls, options.version, callback);
  }

  /**
   * Watch specified data.
   * @param {Object} [options] - Options for watch.
   * @param {String} options.path - Path of the node you are watching.
   * @param {String} [options.type] - Watching type. Cound be 'existence', 'children', or 'data'. If not specified, all above will be watched.
   * @param {Funtion} listener - Will be called once data changed.
   */
  watch(options, listener) {
    assert(options.path);
    // TODO 实现缓存，不重复订阅
    if (!listener) {
      listener = options;
      options = {};
    }

    const fnName = watchTypeToFnMap[options.type];
    if (!fnName) {
      this._client.exists(options.path, listener, () => {});
      this._client.getChildren(options.path, listener, () => {});
      this._client.getData(options.path, listener, () => {});
    } else {
      this._client[fnName](options.path, listener, () => {});
    }
  }

  /**
   * Create given path in a way similar to `mkdir -p`.
   * @param {String} path - Path of the node.
   * @param {Object} options - Options for mkdir.
   * @param {Buffer|String} [options.data=null] - The data buffer.
   * @param {Array<ACL>} [options.acls=ACL.OPEN_ACL_UNSAFE] - An array of ACL objects.
   * @param {CreateMode} [options.mode=CreateMode.PERSISTENT] - The creation mode.
   * @return {String} Returns the created path.
   */
  * mkdirp(path, options = {}) {
    if (options.data && !Buffer.isBuffer(options.data)) {
      options.data = Buffer.from(options.data, options);
    }

    return yield callback => this._client.mkdirp(path, options.data, options.acls, options.mode, callback);
  }

  /**
   * Add the specified scheme:auth information to this client.
   * @param {String} scheme - The authentication scheme.
   * @param {Buffer|String} auth - The authentication data buffer.
   */
  * addAuthInfo(scheme, auth) {
    if (auth && !Buffer.isBuffer(auth)) {
      auth = Buffer.from(auth);
    }

    this._client.addAuthInfo(scheme, auth);
  }

  close() {
    this._client.close();
  }
}

module.exports = ZooKeeperRealClient;
