'use strict';

const mm = require('egg-mock');
const assert = require('assert');

describe('test/index.test.js', () => {
  let app;
  before(function* () {
    app = mm.app({
      baseDir: 'apps/zk',
    });
    yield app.ready();
  });
  afterEach(mm.restore);
  after(function* () {
    yield app.close();
  });

  it('should create zk client ok', function* () {
    const client = new app.zk.createClient('localhost:2181');
    yield client.ready();

    const path = '/unittest3';

    const isExsits = yield cb => {
      client.exists(path, (err, data) => cb(err, data));
    };

    if (isExsits) {
      yield cb => {
        client.remove(path, (err, data) => cb(err, data));
      };
    }

    yield cb => {
      client.create(path, (err, data) => cb(err, data));
    };
    client.watch(path, (err, data) => {
      if (err) {
        client.emit('error', err);
        return;
      }
      if (data) {
        client.emit(path, data);
      }
    });

    client.setData(path, new Buffer('123'), () => {});
    let ret = yield client.await(path);
    assert(ret.toString() === '123');

    client.setData(path, new Buffer('321'), () => {});
    ret = yield client.await(path);
    assert(ret.toString() === '321');
  });

  it('should emit error if create zk failed', done => {
    const client = new app.zk.createClient('localhost:2181');
    assert(client === new app.zk.createClient('localhost:2181'));

    mm(app.coreLogger, 'error', err => {
      assert(err.message === 'mock error');
      done();
    });
    client.emit('error', new Error('mock error'));
  });
});
