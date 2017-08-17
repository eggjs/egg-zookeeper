'use strict';

module.exports = {
  write: true,
  plugin: 'autod-egg',
  prefix: '^',
  devprefix: '^',
  exclude: [
    'zookeeper-3.4.6',
  ],
  devdep: [
    'autod',
    'autod-egg',
    'egg-mock',
    'egg',
    'egg-bin',
    'eslint',
    'eslint-config-egg',
  ],
  keep: [],
  semver: [],
};
