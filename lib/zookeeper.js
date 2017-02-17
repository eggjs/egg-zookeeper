'use strict';

const assert = require('assert');
const Base = require('sdk-base');
const zk = require('node-zookeeper-client');

class ZooKeeper extends Base {
  constructor(options) {
    super(options);
    assert(options.connectionString, 'options.connectionString is required');
    assert(options.sessionTimeout, 'options.sessionTimeout is required');
    assert(options.spinDelay, 'options.spinDelay is required');
    assert(options.retries, 'options.retries is required');
    this._options = options;

    const client = this._client = zk.createClient(options.connectionString, options);
    client.once('connected', () => this.ready(true));
    client.connect();
  }

  /**
   * Create a node with given path, data, acls and mode.
   * @param {String} path - Path of the node.
   * @param {Object} [options] - Options for create.
   * @param {Buffer} [options.data=null] - The data buffer.
   * @param {Array} [options.acls=ACL.OPEN_ACL_UNSAFE] - An array of ACL objects.
   * @param {CreateMode} [options.mode=CreateMode.PERSISTENT] - The creation mode.
   * @return {String} Returns the created node path.
   */
  * create(path, options) {
    options = options || {};
    return yield callback => this._client.create(path, options.data, options.acls, options.mode, callback);
  }

  /**
   * Delete a node with the given path and version.
   * @param {String} path - Path of the node.
   * @param {Object} [options] - Options for remove.
   * @param {Number} [options.version=-1] - The version of the node. If version is provided and not equal to -1, the request will fail when the provided version does not match the server version.
   */
  * remove(path, options) {
    options = options || {};
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
   * @param {Buffer} data - The data buffer.
   * @param {Object} [options] - Options for setData.
   * @param {Number} [options.version=-1] - If the given version is -1, it matches any node's versions.
   * @return {Stat} Returns the stat of the node.
   */
  * setData(path, data, options) {
    options = options || {};
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
  * setACL(path, acls, options) {
    options = options || {};
    return yield callback => this._client.setACL(path, acls, options.version, callback);
  }



  close() {
    this._client.close();
  }
}

module.exports = ZooKeeper;
