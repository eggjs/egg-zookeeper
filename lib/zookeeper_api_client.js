'use strict';

const Base = require('sdk-base');
const utils = require('./utils');
const consts = require('./consts');
const delegates = require('delegates');
const cluster = require('cluster-client');
const zk = require('node-zookeeper-client');
const ZookeeperRealClient = require('./zookeeper_real_client');
const ACL = require('./classes/acl');

class ZookeeperAPIClient extends Base {
  constructor(options) {
    super(options);

    this._client = (options.cluster || cluster)(ZookeeperRealClient)
      .delegate('watch', 'subscribe')
      .create(options);

    utils.delegateEvents(this._client, this, consts.events);

    this._client.ready(() => this.ready(true));
  }

  * getACL(path) {
    const ret = yield this._client.getACL(path);
    if (ret && ret.acls) {
      ret.acls = ret.acls.map(ACL.decode);
    }
    return ret;
  }
}

delegates(ZookeeperAPIClient.prototype, '_client')
  .method('create')
  .method('remove')
  .method('exists')
  .method('getChildren')
  .method('getData')
  .method('setData')
  .method('setACL')
  .method('mkdirp')
  .method('close')
  .method('watch')
  .method('addAuthInfo');

[ 'Permission', 'CreateMode', 'State', 'Event', 'Exception' ].forEach(prop => {
  ZookeeperAPIClient[prop] = zk[prop];
});

ZookeeperAPIClient.Id = require('./classes/id');
ZookeeperAPIClient.ACL = require('./classes/acl');

module.exports = ZookeeperAPIClient;
