'use strict';

const mm = require('egg-mock');
const assert = require('assert');

describe('test/zookeeper.test.js', () => {
  let app;
  before(() => {
    app = mm.app({
      baseDir: 'apps/zookeeper-test',
    });
    return app.ready();
  });

  after(() => app.close());
  afterEach(mm.restore);

  it('should ready', () => {
    assert(app.zookeeper);
  });
});
