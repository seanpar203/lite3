'use strict';

/**  Created by sean on 31/03/2016. */

// Dependencies
const Promise = require('bluebird');
const sqlite3 = require('sqlite3').verbose();

/**
 * Class giving node-SQLite3 library some sugar
 */
class lite3 {

	/**
	 * Create DB Connection with SQLite3 File
	 * @param {string} file - Name of SQLite3 file to connect
	 */
	constructor(file) {
		this.db = new sqlite3.cached.Database(file);
		this.tableName = null;
		this.stmt = null;
		this.queryStmt = null;
		this.queryType = null;
	}

	/**
	 * Sets lite3.tableName property to perform operations.
	 * @param {string} tbl - Name of table to perform operations.
	 * @returns {lite3} - The Class with lite3.tableName property now set.
	 */
	table(tbl) {
		this.tableName = tbl;
		return this;
	}

	/**
	 *  Prepares UPDATE statement to run with lite3.values()
	 * @param {string} query - Sets lite3.stmt with UPDATE query syntax.
	 * @returns {lite3} - Class with lite3.stmt property set.
	 */
	update(query) {
		this.stmt = this.db.prepare(`UPDATE ${this.tableName} SET ${query} WHERE id=?`);
		this.queryStmt = query;
		this.queryType = 'UPDATE';
		return this;
	}

	/**
	 *  Prepares INSERT statement to run with lite3.values()
	 * @param {string} query - Question marks equal to the amount of values inserting
	 * @returns {lite3} - Class with lite3.stmt, lite3.queryStmt, lite3.queryType property set
	 */

	insert(query) {
		this.stmt = this.db.prepare(`INSERT INTO ${this.tableName} VALUES (${query})`);
		this.queryStmt = query;
		this.queryType = 'INSERT';
		return this;
	}

	/**
	 *  Prepares DELETE statement to run with lite3.values()
	 * @returns {lite3}
	 */
	del() {
		this.stmt = this.db.prepare(`DELETE FROM ${this.tableName} WHERE id=?`);
		this.queryType = 'DELETE';
		return this;
	}

	/**
	 * Reassigns lite3.stmt with the new clause to perform query.
	 * @param {string} clause - Clause to perform query.
	 * @returns {lite3} - Class to perform query.
	 */
	clause(clause) {
		switch (this.queryType !== null) {

			case this.queryType == 'UPDATE':
				this.stmt = this.db.prepare(`UPDATE ${this.tableName} SET ${this.queryStmt} WHERE ${clause}`);
				break;

			case this.queryType == 'DELETE':
				this.stmt = this.db.prepare(`DELETE FROM ${this.tableName} WHERE ${clause}`);
				break;
		}
		return this;
	}

	/**
	 * Sugar method which read like english.
	 * @param {string} clause - Clause to include into new lite3.stmt.
	 * @returns {lite3} - Class to perform query.
	 */
	where(clause) {
		return this.clause(clause);
	}

	/**
	 * Runs values using lite3.stmt query created from lite3.update(), lite3.prepare() methods
	 * @param {string} vals - Values to update or insert, must be in order with lite3.stmt to succeed
	 * @param {boolean} [returnChange] - True to return promise of changed lastID and changes
	 */
	values(vals, returnChange) {
		if (returnChange !== true) {
			this.stmt.run(vals);
			this.stmt.finalize();
			return;
		}
		return new Promise((resolve, reject) => {
			this.stmt.run(vals, [], (err, res) => {
				if (err) {
					reject(err);
				}
				else {
					resolve(this);
				}
			})
		})
	}

	/**
	 * Returns a promise of SELECT * SQL query on the lite3.tableName property
	 */
	selectAll() {
		return new Promise((resolve, reject) => {
			this.db.all(`SELECT * FROM ${this.tableName}`, [], (err, res) => {
				if (err) {
					reject(Error(`Error finding rows associated with ${this.tableName} table`))
				}
				resolve(res);
			})
		})
	}

	/**
	 * Find a speicifc row in lite3.tableName with constraint
	 * @param {string} clause - constraint on which row to find
	 */
	selectWhere(clause) {
		return new Promise((resolve, reject) => {
			this.db.get(`SELECT * FROM ${this.tableName} WHERE ${clause}`, (err, row) => {
				if(err) {
					reject(Error(`Unable to find row in the ${this.tableName} table WHERE ${clause}`));
					return;
				}
				resolve(row);
			})
		})
	}

	/**
	 * Returns a promise of schema on lite.tableName if lite.tableName == * return lite3.allTables()
	 */
	schema() {
		if (this.tableName !== '*') {
			return new Promise((resolve, reject) => {
				this.db.all(`PRAGMA TABLE_INFO(${this.tableName})`, (err, res) => {
					if (err) {
						reject(err)
					}
					resolve(res);
				})
			});
		}
		return this.allTables();
	}

	/**
	 * Returns a promise of all table names in the DB
	 */
	allTables() {
		return new Promise((resolve, reject) => {
			this.db.all('SELECT name FROM sqlite_master WHERE type="table"', (err, res) => {
				if (err) {
					reject(Error('Either invalid database on new lite3 instance or no existing tables in DB'));
				}
				resolve(res);
			})
		})
	}
}

module.exports = lite3;
