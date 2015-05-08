


## Configuration

[xxx] is configurable by editing the `config.json` file.

``` json
{
    "databaseUrl" : "mongodb://username:password@serverip:port/database?options",
    "outDir": "/path/to/data",
    "logLevel": "debug",
    "gitAuthor": "MongoBot",
    "gitAuthorEmail": "noreply@dacgroup.com"
}
```

**databaseUrl**: the connection string should follow the format described in [the mongo connection string docs](http://docs.mongodb.org/manual/reference/connection-string).

**outDir**: the target path where data should be written (defaults to *./out*).

**logLevel**: the debug level to set for the internal logger (defaults to *./info*).

**gitEnabled**: if set to *true*, commit changes to a repository and then attempt to push those changes to the **origin** remote (defaults to *false*).

**gitAuthor**: the name to use as the commit author if pushing to Git (defaults to *MongoBot*).

**gitAuthorEmail**: the email address to associate with the *gitAuthor* (defaults to *./info*).

## Git Integration

If the **gitEnabled** option is set, the **outDir** can be Git-enabled by setting up a local repo.

```
cd /path/to/outDir
git init
```

If you would like [xxx] to push updates to a remote server (ex: GitHub, Bitbucket), a `remote` would need to be defined.

```
cd /path/to/outDir
git remote add origin <remote url>
```