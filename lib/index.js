'use strict';

const assert = require('assert');
const zookeeper = require('zookeeper-cluster-client');

module.exports = app => {
  const instances = new Map(); // <string, zkClient>

  function createClient(connectionString, options) {
    assert(connectionString, '[egg-zookeeper] connectionString is required');
    if (instances.has(connectionString)) {
      return instances.get(connectionString);
    }
    const client = zookeeper.createClient(connectionString, Object.assign({
      cluster: app.cluster,
    }, options));
    instances.set(connectionString, client);

    client.ready(err => {
      if (err) {
        app.coreLogger.error(err);
      } else {
        app.coreLogger.info('[egg-zookeeper#%s] zk client is ready, connectionString=%s', app.type, connectionString);
      }
    });
    client.on('error', err => {
      app.coreLogger.error(err);
    });

    // notify agent to create the leader
    if (app.type !== 'agent') {
      app.messenger.sendToAgent('create_zk_leader', connectionString);
    }

    app.coreLogger.info('[egg-zookeeper#%s] create zk leader, connectionString=%s', app.type, connectionString);
    return client;
  }

  // listen to create_zk_leader in agent
  if (app.type === 'agent') {
    app.messenger.on('create_zk_leader', connectionString => {
      createClient(connectionString);
    });
  }

  app.zk = {
    createClient,
    instances,
  };

  app.beforeClose(function* () {
    yield Array.from(instances.values()).map(client => client.close());
  });
};
