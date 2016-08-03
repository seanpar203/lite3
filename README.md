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


# API
If you need a deeper understanding [Node-SQLite3] API Docs (https://github.com/mapbox/node-sqlite3/wiki/API) provides all the internal workings which this library is built on.

### lite3(file)
``` js
/**
* Create DB Connection with SQLite3 File
* @param {string} file - Name of SQLite3 file to connect
*/
const lite = require('lite3');
const lite3 = new lite('DBname.db');
```


### lite3.table(tbl)
```js
/**
 * Sets lite3.tableName property to perform operations.
 * @param {string} tbl - Name of table to perform operations.
 * @returns {lite3} - The Class with lite3.tableName property now set.
 */
 
 lite3.table('users')
```

### lite3.update(query)
```js
/**
 *  Prepares UPDATE statement to run with lite3.values()
 * @param {string} query - Sets lite3.stmt and UPDATE query syntax.
 * @returns {lite3} - Class with lite3.stmt & lite3.queryType property set.
 */
 lite3
 .table('people')
 .update('name=?, age=?')
 .values(['Sean', 25]
```


### lite3.insert(query)
This method can be confusing so we'll use a simple example database to simplify it.

`people (id INTEGER PRIMARY KEY ASC , name varchar(255), age INTEGER);`

* passing in '?, ?, ?' as a string is the same as 'id=?, name=?, age=?'
* Passing in null to the id parameter makes the DB handle the auto increment.
```js
/**
*  Prepares INSERT statement to run with lite3.values()
* @param {string} query - Question marks equal to the amount of values inserting
* @returns {lite3} - Class with lite3.stmt, lite3.queryStmt and lite3.queryType property set
*/
lite3
  .table('people')
  .insert('?, ?, ?')
  .values([null, 'Sean', 25])
```
equivalent to:

`INSERT INTO people VALUES(id=null, name='Sean', age=25)`

### lite3.del()
Deletes row ONLY accepting id as clause.
```js
/**
 *  Prepares DELETE statement to run with lite3.values()
 * @returns {lite3}
 */
 lite3
	.table('people')
	.del()
	.values(1)
```

### lite3.where(clause)
```js
/**
* Sugar method which read like english.
* @param {string} clause - Clause to include into new lite3.stmt.
* @returns {lite3} - Class with clause set.
*/
lite3
  .table('people')
  .update('name=?, age=?')
  .where('id=?')
  .values(['Sean', 25, 1])
```
`UPDATE people VALUES(name='Sean', age=25) WHERE id=1` 


### lite3.values(vals, returnChange)
```js

/**
* Runs values using lite3.stmt query created from lite3.update(), lite3.prepare() methods
* @param {string} vals - Values to update or insert, must be in order with lite3.stmt to succeed
* @param {boolean} [returnChange] - True to return promise of changed lastID and changes
*/

// .values(['Nina', 27, 4], true) - Specificy true as second param to get updated row in .then()
lite3
	.table('people')
	.update('name=?, age=?')
	.where('id=?')
	.values(['Nina', 27, 4], true)
	.then(changes => console.log(changes))
	.catch(err => console.log(err));
	
// Update row with no updated row returned.
lite3
	.table('people')
	.update('name=?, age=?')
	.where('id=?')
	.values(['Nina', 27, 4])
```

### lite3.selectAll()
```js
/**
* Returns a promise of SELECT * SQL query on the lite3.tableName property
*/
lite3
  .table('people')
  .selectAll()
  .then(rows => console.log(rows))
  .catch(err => console.log(err))
```

### lite3.selectWhere(clause)
```js
/**
* Find a speicifc row in lite3.tableName with constraint
* @param {string} clause - constraint on which row to find
*/
lite3
  .table('people')
  .selectWhere('name="Sean"')
  .then(row => console.log(row))
  .catch(err => console.log(err))
```
