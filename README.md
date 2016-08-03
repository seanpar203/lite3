SQLite3 sugar built ontop of [node-sqlite3](https://github.com/mapbox/node-sqlite3) for [Node.js](https://nodejs.org/).

[![NPM](https://nodei.co/npm/lite3.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/lite3/)

## Supported platforms

The `sqlite3` module which `lite3` is built on works with Node.js v0.10.x, v0.12.x, v4.x, and v5.x.

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

# Non Trivial Usage.
Check the [`Api`](#api)section to understand more. 

### Creating Instance
* `{string}` `tbl` - Name of the table desired to perform SQL queries.
EX: 
``` js 
lite3.table('blog_post')
```

### Querying Database Table.
```js
lite3
  .table('blog_post')
  .selectAll()
  .then(rows => console.log(rows))
  .catch(err => console.log(err));
```

### Update Row
```js
lite3
  .table('blog_post')
  .update('date=?, title=?')
  .where('id=?')
  .values(['04-12-2016',' Awesome New Tittle', 1], true)
  .then(changes =>  console.log(changes))
  .catch(err => console.log(err));
```


### Create New Row
```js
			lite3
				.table('people')
				.insert('?,?,?')
				.values([null, 'Nina', 27])
```


# Api

### lite3(file)
``` js
/**
* Create DB Connection with SQLite3 File
* @param {string} file - Name of SQLite3 file to connect
*/
const lite = require('lite3');
const lite3 = new lite('DBname.db');
```
