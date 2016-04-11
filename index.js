'use strict';

/**  Created by sean on 31/03/2016. */
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
	 * @returns {lite3} - The Class with tableName property now set.
	 */
	table(tbl) {
		this.tableName = tbl;
		return this;
	}

	/**
	 * Prepares update statement with query to run with lite3.values() while setting lite3.queryStmt and lite3.queryType properties
	 * @param {string} query - Sets lite3.stmt with UPDATE query syntax.
	 * @returns {lite3} - Class with lite3.stmt property now set.
	 */
	update(query) {
		this.stmt = this.db.prepare(`UPDATE ${this.tableName} SET ${query}`);
		this.queryStmt = query;
		this.queryType = 'UPDATE';
		return this;
	}

	/**
	 * Reassigns lite3.stmt with the new clause to perform query.
	 * @param {string} cl - Clause to perform query.
	 * @returns {lite3} - Class to perform query.
	 */
	clause(cl) {
		switch (this.queryType !== null) {

			case this.queryType == 'UPDATE':
				this.stmt = this.db.prepare(`UPDATE ${this.tableName} SET ${this.queryStmt} ${cl}`);
		}
		return this;
	}

	/**
	 * Sugar method which read like english.
	 * @param {string} clause - Clause to include into new lite3.stmt.
	 * @returns {lite3} - Class to perform query.
	 */
	where(clause) {
		switch (this.queryType !== null) {

			case this.queryType == 'UPDATE':
				this.stmt = this.db.prepare(`UPDATE ${this.tableName} SET ${this.queryStmt} WHERE ${clause}`);
		}
		return this;
	}

	/**
	 * Runs values using lite3.stmt query created from lite3.update(), lite3.prepare() methods
	 * @param {string} vals - Values to update or insert, must be in order with lite3.stmt to succeed
	 * @param {boolean} [returnChange] - True to return promise of changed lastID and changes
	 */
	values(vals, returnChange) {
		console.log(this.stmt);
		console.log(vals);

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
	 * Returns a promise of all of the info on the lite.tableName
	 */
	tableInfo() {
		return new Promise((resolve, reject) => {
			this.db.all(`PRAGMA TABLE_INFO(${this.tableName})`, (err, res) => {
				if (err) {
					reject(err)
				}
				resolve(res);
			})
		})
	}

	/**
	 * Returns a promise of all the tables in the DB
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
