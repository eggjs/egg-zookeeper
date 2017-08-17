'use strict';

module.exports = app => {
  app.get('/create', function* () {
    const path = this.query.path;
    const client = this.zk.createClient('localhost:2181');
    yield client.ready();
    yield cb => {
      client.mkdirp(path, (err, data) => cb(err, data));
    };
    this.logger.info('mkdirp %s', path);
    this.body = 'ok';
  });

  app.get('/setData', function* () {
    const path = this.query.path;
    const value = this.query.value;
    this.logger.info('try to setData %s=%s', path, value);
    const client = this.zk.createClient('127.0.0.1:2181');
    yield client.ready();
    yield cb => {
      client.setData(path, new Buffer(value), (err, data) => cb(err, data));
    };
    this.logger.info('setData %s=%s', path, value);
    this.body = 'ok';
  });

  app.get('/getData', function* () {
    const path = this.query.path;
    const client = this.zk.createClient('127.0.0.1:2181');
    yield client.ready();
    const data = yield cb => {
      client.getData(path, (err, data) => cb(err, data));
    };
    const value = data.toString();
    this.logger.info('getData %s=%s', path, value);
    this.body = value;
  });
};
