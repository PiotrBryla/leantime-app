// Just a mock test

var assert = require('assert');

describe('Array', function() {
  describe('#indexOf()', function() {
    it('Mock Test: should return -1 when the value is not present in the array', function() {
      assert.equal([1,2,3].indexOf(4), -1);
    });
  });
});
