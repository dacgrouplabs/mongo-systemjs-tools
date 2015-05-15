var argv = require('minimist')(process.argv.slice(2))
  , MongoClient = require('mongodb').MongoClient
  , helper = require('./helpers.js')
  , log = helper.log
  , format = helper.format
  , url = argv.url;

if (url == null)
    throw("no --url param specified");

var dbname;
MongoClient.connect(url, function(err, db) {
    if (err) {
        log.error("DUMP | error establishing connection.");
        throw err;
    } else {
        db.collection("system.js", function(err, coll) {
            dbname = db.databaseName;
            if (err) {
                log.error("DUMP | could not find system.js collection in this db.");
            } else {
                coll.find({}, { sort: { "_id": 1 } }).toArray(function(err, docs) {
                    if (err) {
                        log.error("DUMP | " + err);
                    } else {
                        for (var i = 0; i < docs.length; i++) {
                            var funcName = docs[i]._id;
                            var filename = format("%s.%s.js", dbname, funcName);
                            log.debug("DUMP | writing %", filename);
                            helper.writeFile(filename, docs[i].value.code);
                        }
                    }
                });
            }
        });
    }
});