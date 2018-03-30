'use strict';

module.exports = app => {
  app.get('/create', async function(ctx) {
    const path = ctx.query.path;
    const client = ctx.zk.createClient('localhost:2181');
    await client.ready();
    await client.mkdirp(path);

    ctx.logger.info('mkdirp %s', path);
    ctx.body = 'ok';
  });

  app.get('/setData', async function(ctx) {
    const path = ctx.query.path;
    const value = ctx.query.value;
    ctx.logger.info('try to setData %s=%s', path, value);
    const client = ctx.zk.createClient('127.0.0.1:2181');
    await client.ready();
    await client.setData(path, new Buffer(value));
    ctx.logger.info('setData %s=%s', path, value);
    ctx.body = 'ok';
  });

  app.get('/getData', async function(ctx) {
    const path = ctx.query.path;
    const client = ctx.zk.createClient('127.0.0.1:2181');
    await client.ready();
    const data = await client.getData(path);
    const value = data.toString();
    ctx.logger.info('getData %s=%s', path, value);
    ctx.body = value;
  });
};
