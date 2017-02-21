'use strict';

const mm = require('egg-mock');
const assert = require('assert');

describe('test/zookeeper.test.js', () => {
  const path = '/shaoshuai0102/1234';
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
    const ret = yield app.zookeeper.create(path);
    assert(ret === '/shaoshuai0102/1234');
    const stat = yield app.zookeeper.exists(path);
    assert(stat);
    assert(stat.version === 0);
  });

  it('#setData() && #getData() && #exists()', function* () {
    yield app.zookeeper.setData(path, '3212');
    let stat = yield app.zookeeper.exists(path);
    assert(stat.version === 1);

    let ret = yield app.zookeeper.getData(path);
    assert(ret.data);
    assert(ret.stat);
    assert(ret.data.toString() === '3212');

    yield app.zookeeper.setData(path, '32122');
    stat = yield app.zookeeper.exists(path);
    assert(stat.version === 2);

    ret = yield app.zookeeper.getData(path);
    assert(ret.data);
    assert(ret.stat);
    assert(ret.data.toString() === '32122');
  });

  it('#getChildren()', function* () {
    yield [
      app.zookeeper.create(path + '/1'),
      app.zookeeper.create(path + '/2'),
      app.zookeeper.create(path + '/3'),
    ];

    const ret = yield app.zookeeper.getChildren(path);
    assert.deepEqual(ret.children, [ '1', '2', '3' ]);
    assert(ret.stat.version === 2);
  });

  it('#setACL() && #getACL()', function* () {
    const ADMIN = app.ZooKeeper.Permission.ADMIN;
    const id = new app.ZooKeeper.Id('ip', '127.0.0.1');
    const acl = new app.ZooKeeper.ACL(ADMIN, id);
    yield app.zookeeper.setACL(path, acl);
    const ret = yield app.zookeeper.getACL(path);
    console.log('ret', ret);
    assert(ret.stat);
    assert(ret.acls);
  });

  it('#remove() && exists()', function* () {
    yield [
      app.zookeeper.remove(path + '/1'),
      app.zookeeper.remove(path + '/2'),
      app.zookeeper.remove(path + '/3'),
    ];

    yield app.zookeeper.remove(path);
    const stat = yield app.zookeeper.exists(path);
    assert(stat === null);
  });
});
