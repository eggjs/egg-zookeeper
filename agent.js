'use strict';

const utils = require('./lib/utils');
const ZooKeeperAPIClient = require('./lib/zookeeper_api_client');

module.exports = agent => {
  const options = agent.config.zookeeper;
  utils.convertMs(options, [ 'sessionTimeout', 'spinDelay', 'retries' ]);

  const opts = Object.assign({}, options, { cluster: agent.cluster.bind(agent) });
  const zookeeper = agent.zookeeper = new ZooKeeperAPIClient(opts);

  agent.beforeStart(function* () {
    yield zookeeper.ready();
  });
};
