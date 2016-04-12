'use strict';
/**  Created by sean on 11/04/2016. */

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('test.db');

const names = ['Sean', 'Jason', 'Peter', 'Parker', 'Matt', 'Jeff', 'Gabby', 'Preston', 'Alice'];

const ages = [24, 26, 30, 35, 50, 22, 17, 19, 32];


db.serialize(function () {

	db.run("CREATE TABLE if not exists people (" +
		"id INTEGER PRIMARY KEY ASC , " +
		"name varchar(255), " +
		"age INTEGER)"
	);

	var stmt = db.prepare("INSERT INTO people VALUES (?,?,?)");
	for (var i = 0; i < names.length; i++) {
		let name = names[i];
		let age = ages[i];
		stmt.run( null, name, age);
	}
	stmt.finalize();

	db.all('SELECT * FROM people', (err, rows) => {
		if(err) {
			console.log(err);
		}
		console.log(rows);
	})
});

db.close();