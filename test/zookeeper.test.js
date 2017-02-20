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

  it('#create() && exists()', function* () {
    const path = '/shaoshuai0102/1234';
    const ret = yield app.zookeeper.create(path);
    assert(ret === '/shaoshuai0102/1234');
    const stat = yield app.zookeeper.exists(path);
    console.log('stat', stat);
    // TODO stat 在 APIClient 上实现下
    assert(stat);
  });

  it('#remove() && exists()', function* () {
    const path = '/shaoshuai0102/1234';
    yield app.zookeeper.remove(path);
    const stat = yield app.zookeeper.exists(path);
    assert(stat === null);
  });
});
