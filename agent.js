'use strict';

const ZooKeeper = require('zookeeper');

module.exports = agent => {
  console.log('agent.config.env =', agent.config.env);

  const zookeeper = new ZooKeeper({
    connect: "localhost:2181",
    timeout: 200000,
    debug_level: ZooKeeper.ZOO_LOG_LEVEL_WARN,
    host_order_deterministic: false,
  });
};
