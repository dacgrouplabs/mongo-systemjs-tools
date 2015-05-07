var exec = require('child_process').exec
  , path = require('path')
  , fs = require('fs')
  , format = require('util').format
  , config = require('./config.json')
  , log = require('simple-node-logger').createSimpleLogger();

log.setLevel('debug');

module.exports = {
  log: log,
  config: config,
  format: format,
  write: writeOplogEntryToDisk
};

const TAB_SIZE = 4;
var outDir = config.outDir || "./out";

function writeOplogEntryToDisk(doc) {
  // TODO check for failure
  shell(format("mkdir -p \"%s\"", outDir));

  // strip out the common namespace and convert periods to path seperators
  var db = doc.ns.replace(".system.js", "");
  var funcName = doc.o._id;
  var fn = format("%s.%s.js", db, funcName);

  writeFile(fn, doc.o.value.code);
}

function shell(cmd) {
  exec(cmd, function (error, stdout, stderr) {
    // output is in stdout
  });
}

function writeFile(filename, data) {
  var outfile = path.join(outDir, filename);
  fs.writeFile(outfile, data, function(err) {
    if(err)
      log.error("[writeFile] " + err);

    log.info("[writeFile] " + outfile);
  });
}