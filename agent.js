'use strict';

const utils = require('./lib/utils');
const ZooKeeperClient = require('node-zookeeper-client').Client;

module.exports = agent => {
  const options = agent.config.zookeeper;
  utils.convertMs(options, [ 'sessionTimeout', 'spinDelay', 'retries' ]);

  agent
    .cluster(ZooKeeperClient)
    .create(options);
};
