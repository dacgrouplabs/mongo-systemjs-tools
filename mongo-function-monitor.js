var MongoOplog = require('mongo-oplog')
  , config = require('./config.json')
  , log = require('simple-node-logger').createSimpleLogger();

log.setLevel('debug');

var oplog = MongoOplog(config.databaseUrl);

oplog.filter('*.system.js').on('op', function (data) {
  log.info(data);
});

oplog.on('error', function (error) {
  log.error(error);
});

oplog.on('end', function () {
  log.debug('stream end');
});

oplog.stop(function () {
  log.debug('server stopped');
});

oplog.tail(function() {
  log.debug("tailing oplog ...");
});