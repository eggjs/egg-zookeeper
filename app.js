'use strict';

const await = require('await-event');
const utils = require('./lib/utils');
const ZooKeeperClient = require('node-zookeeper-client').Client;

module.exports = app => {
  const options = app.config.zookeeper;
  utils.convertMs(options, [ 'sessionTimeout', 'spinDelay', 'retries' ]);

  const zookeeper = app.zookeeper = app
    .cluster(ZooKeeperClient)
    .delegate('connect')
    .override('await', await)
    .create(options.connectionString, options);


  app.beforeStart(function* () {
    yield zookeeper.await('connected');
  });
};
