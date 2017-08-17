'use strict';

const mm = require('egg-mock');
const assert = require('assert');

describe('test/cluster.test.js', () => {
  let app;
  before(function* () {
    app = mm.cluster({
      baseDir: 'apps/zk',
    });
    yield app.ready();
  });
  afterEach(mm.restore);
  after(function* () {
    yield app.close();
  });

  const testpath = '/unittest4';
  const testdata = 'unittest-data:' + Date.now();

  it('should create zk client & get data ok', function* () {
    let ret = yield app.httpRequest()
      .get(`/create?path=${testpath}`)
      .expect(200)
      .then(res => {
        return res.text;
      });
    assert(ret === 'ok');

    ret = yield app.httpRequest()
      .get(`/setData?path=${testpath}&value=${testdata}`)
      .expect(200)
      .then(res => {
        return res.text;
      });
    assert(ret === 'ok');

    ret = yield app.httpRequest()
      .get(`/getData?path=${testpath}`)
      .expect(200)
      .then(res => {
        return res.text;
      });
    assert(ret === testdata);
  });
});
