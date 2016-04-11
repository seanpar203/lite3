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

	// table()
	describe('table()', function () {
		it('should set the lite3.tableName property', function () {
			lite3.table('people');
			expect(lite3.tableName).to.include('people');
		});
	});

	// table().update()
	describe('table().update()', function () {
		it('should set lite3.stmt, lite3.queryStmt and lite3.queryType', function () {
			lite3.table('people').update('(?,?,?)');
			expect(lite3.tableName).to.equal('people');
			expect(lite3.queryStmt).to.equal('(?,?,?)');
			expect(lite3.queryType).to.equal('UPDATE');
		});
	});
	
	

});

