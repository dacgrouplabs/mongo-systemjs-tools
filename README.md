


## Configuration

[xxx] is configurable by editing the `config.json` file.

``` json
{
    "databaseUrl" : "mongodb://username:password@serverip:port/database?options",
    "outDir": "/path/to/data",
    "logLevel": "debug"
}
```

**databaseUrl**: the connection string should follow the format described in [the mongo connection string docs](http://docs.mongodb.org/manual/reference/connection-string).

**outDir**: the target path where data should be written (defaults to *./out*).

**logLevel**: the debug level to set for the internal logger (defaults to *./info*).

## Git Integration

The `outDir` defined in the above configuration file can be Git-enabled by setting up a local repo.

```
cd /path/to/outDir
git init
```

If you would like [xxx] to push updates to a remote server (ex: GitHub, Bitbucket), a `remote` would need to be defined.

```
cd /path/to/outDir
git remote add origin <remote url>
```