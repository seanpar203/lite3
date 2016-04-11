'use strict';
// Testing Deps
const chai = require('chai');

// Chai sugar reassignments
const expect = chai.expect;
const should = chai.should();
const assert = chai.assert;

// Library
const lite = require('./../index');


describe('lite3-tests', function () {

	// table()
	describe('table()', function () {
		it('should set the tableName property', function () {
			let lite3 = new lite('test.db');
			lite3.table('people');
			expect(lite3.tableName).to.include('people');
		});
	});

	

});

