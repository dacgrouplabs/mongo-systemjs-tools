var MongoOplog = require('mongo-oplog')
  , helper = require('./lib/helpers.js')
  , log = helper.log
  , format = helper.format;

var oplog = MongoOplog(helper.config.databaseUrl);

oplog.filter('*.system.js').on('op', function (data) {
  log.info(format("[%s] db: %s, func: %s", data["op"], data["ns"].replace('.system.js', ''), data["o"]["_id"]));
  helper.write(data);
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