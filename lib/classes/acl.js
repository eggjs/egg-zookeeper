'use strict';

const zk = require('node-zookeeper-client');
const Id = require('./id');

class ACL extends zk.ACL {
  static decode(data) {
    return new ACL(data.permission, Id.decode(data.id));
  }
}

module.exports = ACL;
