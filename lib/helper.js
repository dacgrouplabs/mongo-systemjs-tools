var exec = require('child_process').exec
  , path = require('path')
  , fs = require('fs')
  , format = require('util').format
  , config = require('./config.json')
  , log = require('simple-node-logger').createSimpleLogger()
  , nodegit = require('nodegit');

module.exports = {
  log: log,
  config: config,
  format: format,
  write: writeOplogEntryToDisk,
  writeFile: writeFile
};

log.setLevel(config.logLevel || 'info');

var outDir = config.outDir || './out';

function writeOplogEntryToDisk(doc) {

  exec(format('mkdir -p \"%s\"', outDir),
    function (error, stdout, stderr) {
      log.info('stdout: ' + stdout);
      log.warn('stderr: ' + stderr);
      if (error !== null) {
        log.error('exec error: ' + error);
      }
    }
  );

  // strip out the common namespace
  var db = doc.ns.replace('.system.js', '');
  var funcName = doc.o._id;
  var fn = format('%s.%s.js', db, funcName);

  if (doc != null && doc.o != null && doc.o.value != null)
    writeFile(fn, doc.o.value.code);
  else
    log.warn('[writeOplogEntryToDisk] no code block for doc: ' + doc);

  if (config.gitEnabled) {
    checkinFile(fn);
    pushToRemote();
  }
};

function writeFile(filename, data) {
  var outfile = path.join(outDir, filename);
  if(outfile === ''){
    log.error('[writeFile] filename is empty');
  }

  fs.writeFile(outfile, data, function (err) {
    if (err){
      log.error('[writeFile] ' + err);
    }
    else {
      log.info('[writeFile] ' + outfile);
    }
  });
};

function checkinFile(filename) {
  var repo, index, oid;

  repoFolder = path.resolve(outDir, '.git'),
  fileToStage = filename;

  nodegit.Repository.open(repoFolder)
  .then(function (repoResult) {
      repo = repoResult;
      return repoResult.openIndex();
  })
  .then(function (indexResult) {
      index  = indexResult;
      // this file is in the root of the directory and doesn't need a full path
      index.addByPath(fileToStage);
      // this will write files to the index
      index.write();

      return index.writeTree();
  })
  .then(function (oidResult) {
      oid = oidResult;
      return nodegit.Reference.nameToId(repo, 'HEAD');
  })
  .then(function (head) {
      return repo.getCommit(head);
  })
  .then(function (parent) {
      author = nodegit.Signature.now(
        config.gitAuthor || 'MongoBot',
        config.gitAuthorEmail || '');

      return repo.createCommit('HEAD', author, author, filename, oid, [parent]);
  })
  .then(function (commitId) {
      log.debug(format('GIT | committed as %s', commitId));
  });
};

function pushToRemote() {
 var repo, remote;

  repoFolder = path.resolve(outDir, '.git'),
  nodegit.Repository.open(repoFolder)
  .then(function (repoResult) {
      repo = repoResult;
      return repoResult.openIndex();
  })

  .then(function () {
      return repo.getRemote('origin');
  })

  .then(function (remoteResult) {
    log.debug('GIT | remote loaded');
    remote = remoteResult;

    remote.setCallbacks({
        credentials: function (url, userName) {
            return nodegit.Cred.sshKeyFromAgent(userName);
        }
    });

    log.debug('GIT | remote configured');

    return remote.connect(nodegit.Enums.DIRECTION.PUSH);
  })

  .then(function () {
    //console.log('remote Connected?', remote.connected())

    return remote.push(
              ['refs/heads/master:refs/heads/master'],
              null,
              repo.defaultSignature(),
              'Push to master')
  })

  .then(function () {
      log.debug('GIT | remote pushed.')
  })

  .catch(function (reason) {
      log.error(format('GIT | push to remote failed: %s', reasons));
  });
};
