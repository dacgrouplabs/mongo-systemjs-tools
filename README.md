


## Configuration

[xxx] is configurable by editing the `config.json` file.

``` json
{
    "databaseUrl" : "mongodb://username:password@serverip:port/database?options",
    "outDir": "/path/to/data"
}
```

**databaseUrl**: the connection string should follow the format described in [the mongo connection string docs](http://docs.mongodb.org/manual/reference/connection-string).

**outDir**: the target path where data should be written (defaults to *./out*).