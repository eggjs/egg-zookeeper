'use strict';

const await = require('await-event');
const utils = require('./lib/utils');
const ZooKeeperClient = require('node-zookeeper-client').Client;

module.exports = agent => {
  const options = agent.config.zookeeper;
  utils.convertMs(options, [ 'sessionTimeout', 'spinDelay', 'retries' ]);

  const zookeeper = agent.zookeeper = agent
    .cluster(ZooKeeperClient)
    .delegate('connect')
    .override('await', await)
    .create(options.connectionString, options);

  // zookeeper.await = await;

  agent.beforeStart(function* () {
    yield zookeeper.connect();
    yield zookeeper.await('connected');
  });
};
