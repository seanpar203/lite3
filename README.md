SQLite3 sugar built ontop of [node-sqlite3](https://github.com/mapbox/node-sqlite3) for [Node.js](https://nodejs.org/).

[![NPM](https://nodei.co/npm/lite3.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/lite3/)

## Supported platforms

The `sqlite3` which `lite3` is built on works with Node.js v0.10.x, v0.12.x, v4.x, and v5.x.

Binaries for most Node versions and platforms are provided by default via [node-pre-gyp](https://github.com/mapbox/node-pre-gyp).


## Purpose
I created this library to simplify querying, updating, inserting a SQLite3 database.

Example of updating a row:
``` js
lite3
  .table('users')
  .update('name=?, age=?')
  .where('id=1')
  .values('Sean', '24')
```

# Installing
You can use [`npm`](https://www.npmjs.com/) to download and install:

* The latest `lite3` package: `npm install lite3`

# Usage
Check the [`Api`](#api)section to see more examples and uses. 
``` js
const lite = require('lite3');
const lite3 = new lite('database.db')

lite3
  .table('work_history')
  .selectAll()
  .then(rows => console.log(rows))
  .catch(err => console.log(err));
```

# Api

### new lite3(file)
Creates a new `Class` with the passed in file as a the name of the SQLite3 database that you want to connect.
* `{string}` `file` - filename of the database you want to make SQL operations on.

EX: 

``` js
const lite = require('lite3');
const lite3 = new lite('DBname.db');
```
