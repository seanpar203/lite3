'use strict';
// Testing Deps
const chai = require('chai');

// Chai sugar reassignments
const expect = chai.expect;
const should = chai.should();
const assert = chai.assert;

// Library
const lite = require('./../index');
let lite3 = new lite('test.db');


describe('lite3-tests', function () {

	// lite3.table()
	describe('table()', function () {
		it('should set the lite3.tableName property', function () {
			lite3.table('people');
			expect(lite3.tableName).to.include('people');
		});
	});

	// lite3.table().update()
	describe('table().update()', function () {
		it('should set lite3.stmt, lite3.queryStmt and lite3.queryType', function () {
			lite3.table('people').update('?,?,?');
			expect(lite3.stmt).to.not.equal(null);
			expect(lite3.tableName).to.equal('people');
			expect(lite3.queryStmt).to.equal('?,?,?');
			expect(lite3.queryType).to.equal('UPDATE');
		});
	});

	// lite3.table().insert()
	describe('lite3.table().insert()', function () {
		it('should set lite3.stmt, lite3.queryStmt and lite3.queryType', function () {
			// Insert a row into people table
			lite3.table('people').insert('?,?,?');
			expect(lite3.stmt).to.not.equal(null);
			expect(lite3.tableName).to.equal('people');
			expect(lite3.queryStmt).to.equal('?,?,?');
			expect(lite3.queryType).to.equal('INSERT');
		})
	});

	// lite3.table().del()
	describe('lite3.table().del()', function () {
		it('should set lite3.stmt and lite3.queryType', function () {
			lite3.table('people').del();
			expect(lite3.stmt).to.not.equal(null);
			expect(lite3.queryType).to.equal('DELETE');
		})
	});

	// lite3.table().update().where().values()
	describe('lite3.table().insert().values()', function () {
		it('should update values in DB to a new value', function () {

			// Update people table where id=4
			lite3
				.table('people')
				.update('name=?, age=?')
				.where('id=?')
				.values(['Nina', 27, 4], true)
				.then(changes => {

					// Select * people and check where id=4 if update was successful.
					lite3
						.table('people')
						.selectAll()
						.then(peps => {
							expect(peps[3].name).to.equal('Nina');
							expect(peps[3].age).to.equal(27);
						});
				})
		})
	});

	// lite3.table().insert().values()
	describe('lite3.table().insert().values()', function () {
		it('should insert values into DB', function () {

			// Insert into people with values, check change in callback.
			lite3
				.table('people')
				.insert('?,?,?')
				.values([null, 'Nina', 27], true)
				.then(changes => {

					lite3
						.table('people')
						.selectAll()
						.then(rows => {
							let newRow = rows[rows.length - 1];
							expect(newRow.name).to.equal('Nina');
							expect(newRow.age).to.equal(27);
						})
				})
		})
	});

	// lite3.table().del().values()
	describe('lite3.table().del().values()', function () {
		it('should delete a row from the table', function () {

			// Check length of total rows before deleting
			let length = null;
			lite3
				.table('people')
				.selectAll()
				.then(rows => length = rows.length);

			// If length is set, delete the last row and check length
			if (length !== null) {
				lite3
					.table('people')
					.del()
					.values(length - 1, true)
					.then(newRows => expect(newRows.length).to.equal(length - 1))
			}
		})
	});


	// lite3.table().schema()
	describe('lite3.tabl().schema()', function () {
		it('should show all table column data types', function () {
			lite3
				.table('people')
				.schema()
				.then(schema => {

					// Fist Column on people table
					expect(schema[0].type).to.equal('INTEGER');
					expect(schema[0].name).to.equal('id');

					// Second Column on people table
					expect(schema[1].type).to.equal('varchar(255)');
					expect(schema[1].name).to.equal('name');

					// Third Column on people table
					expect(schema[2].type).to.equal('INTEGER');
					expect(schema[2].name).to.equal('age');

					// Total columns on people table
					expect(schema.length).to.equal(3);
				})
		})
	});

	// lite3.table(*).schema()
	describe('lite3.table(*).schema()', function () {
		it('should return name of all tables', function () {

			lite3
				.table('*')
				.schema()
				.then(schema => {
					expect(schema.length).to.equal(1);
					expect(schema[0].name).to.equal('people');
				})
		})
	});

	// lite3.allTables()
	describe('lite3.allTables()', function () {
		it('should return name of all tables', function () {

			lite3
				.allTables()
				.then(names => {
					expect(names.length).to.equal(1);
					expect(names[0].name).to.equal('people');
				})
		})
	})
});

