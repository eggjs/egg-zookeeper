'use strict';

const zk = require('node-zookeeper-client');

class Id extends zk.Id {
  static decode(data) {
    return new Id(data.scheme, data.id);
  }
}

module.exports = Id;
