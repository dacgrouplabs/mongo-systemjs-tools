var exec = require('child_process').exec
  , path = require('path')
  , fs = require('fs')
  , format = require('util').format
  , config = require('./config.json')
  , log = require('simple-node-logger').createSimpleLogger()
  , nodegit = require('nodegit');

log.setLevel(config.logLevel || 'info');

module.exports = {
  log: log,
  config: config,
  format: format,
  write: writeOplogEntryToDisk
};

const TAB_SIZE = 4;
var outDir = config.outDir || "./out";

function writeOplogEntryToDisk(doc) {
  exec(format("mkdir -p \"%s\"", outDir), function (error, stdout, stderr) {
    // TODO: check for failure
    // output is in stdout
  });

  // strip out the common namespace and convert periods to path seperators
  var db = doc.ns.replace(".system.js", "");
  var funcName = doc.o._id;
  var fn = format("%s.%s.js", db, funcName);

  writeFile(fn, doc.o.value.code);
  checkinFile(fn);
}

function writeFile(filename, data) {
  var outfile = path.join(outDir, filename);
  fs.writeFile(outfile, data, function(err) {
    if(err)
      log.error("[writeFile] " + err);

    log.info("[writeFile] " + outfile);
  });
}

function checkinFile(filename) {
  var repo, index, oid, remote;

  repoFolder = path.resolve(outDir, '.git'),
  fileToStage = filename;

  nodegit.Repository.open(repoFolder)
  .then(function(repoResult) {
      repo = repoResult;
      return repoResult.openIndex();
  })
  .then(function(indexResult) {
      index  = indexResult;

      // this file is in the root of the directory and doesn't need a full path
      index.addByPath(fileToStage);

      // this will write files to the index
      index.write();

      return index.writeTree();

  }).then(function(oidResult) {

      oid = oidResult;
      return nodegit.Reference.nameToId(repo, "HEAD");

  }).then(function(head) {

      return repo.getCommit(head);

  }).then(function(parent) {
      author = nodegit.Signature.now("MongoBot", "no-reply@dacgroup.com");

      return repo.createCommit("HEAD", author, author, getDateTime(), oid, [parent]);
  }).then(function(commitId) {
      log.debug(format("commited as %s", commitId));
  })

  // /// PUSH
  // .then(function() {
  //     return repo.getRemote("origin");
  // }).then(function(remoteResult) {

  //   console.log('remote Loaded');
  //   remote = remoteResult;

  //   remote.setCallbacks({
  //       credentials: function(url, userName) {
  //           return nodegit.Cred.sshKeyFromAgent(userName);
  //       }
  //   });

  //   console.log('remote Configured');
  //   return remote.connect(nodegit.Enums.DIRECTION.PUSH);

  // }).then(function() {
  //   console.log('remote Connected?', remote.connected())

  //   return remote.push(
  //             ["refs/heads/master:refs/heads/master"],
  //             null,
  //             repo.defaultSignature(),
  //             "Push to master")
  // }).then(function() {
  //     console.log('remote Pushed!')
  // })
  // .catch(function(reason) {
  //     console.log(reason);
  // });
}

function getDateTime() {
    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return format("%s-%s-%s %s:%s:%s", year, month, day, hour, min, sec);
}