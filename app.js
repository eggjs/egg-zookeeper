'use strict';

const utils = require('./lib/utils');

module.exports = app => {
  const options = app.config.zookeeper;
  utils.convertMs(options, [ 'sessionTimeout', 'spinDelay', 'retries' ]);

  const opts = Object.assign({}, options, { cluster: app.cluster.bind(app) });
  const zookeeper = app.zookeeper = new app.ZooKeeper(opts)
    .on('error', err => app.coreLogger.error(err));

  app.beforeStart(function* () {
    yield zookeeper.ready();
  });
};
