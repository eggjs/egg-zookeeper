'use strict';

const Base = require('sdk-base');
const utils = require('./utils');
const consts = require('./consts');
const delegates = require('delegates');
const cluster = require('cluster-client');
const zk = require('node-zookeeper-client');
const ZookeeperRealClient = require('./zookeeper_real_client');

class ZookeeperAPIClient extends Base {
  constructor(options) {
    super(options);

    this._client = (options.cluster || cluster)(ZookeeperRealClient)
      .delegate('watch', 'subscribe')
      .create(options);

    utils.delegateEvents(this._client, this, consts.events);

    this._client.ready(() => this.ready(true));
  }
}

delegates(ZookeeperAPIClient.prototype, '_client')
  .method('create')
  .method('remove')
  .method('exists')
  .method('getChildren')
  .method('getData')
  .method('setData')
  .method('getACL')
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
