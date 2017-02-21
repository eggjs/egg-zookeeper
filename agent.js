'use strict';

const utils = require('./lib/utils');

module.exports = agent => {
  const options = agent.config.zookeeper;
  utils.convertMs(options, [ 'sessionTimeout', 'spinDelay', 'retries' ]);

  const opts = Object.assign({}, options, { cluster: agent.cluster.bind(agent) });
  const zookeeper = agent.zookeeper = new agent.ZooKeeper(opts)
    .on('error', err => agent.coreLogger.error(err));

  agent.beforeStart(function* () {
    yield zookeeper.ready();
  });
};
