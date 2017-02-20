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

  it('#mkdirp()', function* () {
    const path = yield app.zookeeper.mkdirp('/shaoshuai0102');
    assert(path === '/shaoshuai0102');
  });

  it('#create()', function* () {
    const path = yield app.zookeeper.create('/shaoshuai0102/1234');
    assert(path === '/shaoshuai0102/1234');
  });
});
