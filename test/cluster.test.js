'use strict';

const mm = require('egg-mock');
const assert = require('assert');

describe('test/cluster.test.js', () => {
  let app;
  before(async function() {
    app = mm.cluster({
      baseDir: 'apps/zk',
    });
    await app.ready();
  });
  afterEach(mm.restore);
  after(async function() {
    await app.close();
  });

  const testpath = '/unittest4';
  const testdata = 'unittest-data:' + Date.now();

  it('should create zk client & get data ok', async function() {
    let ret = await app.httpRequest()
      .get(`/create?path=${testpath}`)
      .expect(200)
      .then(res => {
        return res.text;
      });
    assert(ret === 'ok');

    ret = await app.httpRequest()
      .get(`/setData?path=${testpath}&value=${testdata}`)
      .expect(200)
      .then(res => {
        return res.text;
      });
    assert(ret === 'ok');

    ret = await app.httpRequest()
      .get(`/getData?path=${testpath}`)
      .expect(200)
      .then(res => {
        return res.text;
      });
    assert(ret === testdata);
  });
});
