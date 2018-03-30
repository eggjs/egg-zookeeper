'use strict';

const mm = require('egg-mock');
const assert = require('assert');

describe('test/index.test.js', () => {
  let app;
  before(async function() {
    app = mm.app({
      baseDir: 'apps/zk',
    });
    await app.ready();
  });
  afterEach(mm.restore);
  after(async function() {
    await app.close();
  });

  it('should create zk client ok', async function() {
    const client = new app.zk.createClient('localhost:2181');
    await client.ready();

    const path = '/unittest3';
    const isExsits = await client.exists(path);

    if (isExsits) {
      await client.remove(path);
    }

    await client.create(path);

    client.watch(path, (err, data) => {
      if (err) {
        client.emit('error', err);
        return;
      }
      if (data) {
        client.emit(path, data);
      }
    });

    client.setData(path, new Buffer('123'));
    let ret = await client.await(path);
    assert(ret.toString() === '123');

    client.setData(path, new Buffer('321'));
    ret = await client.await(path);
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
