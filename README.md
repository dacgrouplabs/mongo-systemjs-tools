# mongo-systemjs-tools

This package is a collection of utilities that can be used to manage the internal functions stored withing a database's `system.js` collection.

## systemjs-dump

This utility is used to dump all *system.js* functions to file for a specific database.

```
node systemjs-dump.js --url <mongouri>
```

## systemjs-monitor

This utility can monitor a [replicaset](http://docs.mongodb.org/manual/replication/) for changes, and dump those to local files.

Optionally, those files can be checked into and pushed to a remote Git repository.

### Configuration

Configuration options for the utilities within this package can be found within the `config.json` file.

For example:

``` json
{
    "databaseUrl" : "mongodb://username:password@serverip:port/database?options",
    "outDir": "/path/to/data",
    "logLevel": "debug",
    "gitAuthor": "MongoBot",
    "gitAuthorEmail": "noreply@dacgroup.com"
}
```

`databaseUrl`: the connection string should follow the format described in [the mongo connection string docs](http://docs.mongodb.org/manual/reference/connection-string).

`outDir`: the target path where data should be written (defaults to *./out*).

`logLevel`: the debug level to set for the internal logger (defaults to *./info*).

`gitEnabled`: if set to *true*, commit changes to a repository and then attempt to push those changes to the **origin** remote (defaults to *false*).

`gitAuthor`: the name to use as the commit author if pushing to Git (defaults to *MongoBot*).

`gitAuthorEmail`: the email address to associate with the *gitAuthor* (defaults to *./info*).

### Git Integration

If the `gitEnabled` option is set, the `outDir` can be Git-enabled by setting up a local repo.

```
cd /path/to/outDir
git init
```

If you would like **systemjs-monitor** to push updates to a remote server (ex: [GitHub](https://github.com), [Bitbucket](https://bitbucket.com)), a [remote](http://git-scm.com/docs/git-remote) would need to be defined.

```
cd /path/to/outDir
git remote add origin <remote url>
```

## TODO

- [ ] Add a lot more error handling
- [ ] Allow Git initialization of data directory (so user doesn't have to do it manually)
- [ ] Extract Git functionality so it can be used with *systemjs-dump* as well
- [ ] Add hooks to allow external integration (ex: [mongo-linter](https://github.com/dacgrouplabs/mongo-linter)) 
- [ ] Add tests!

## LICENSE

```
Copyright (c) 2015, DAC Group <www.dacgroup.com>
Copyright (c) 2015, Alex Bevilacqua <abevilacqua@dacgroup.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```