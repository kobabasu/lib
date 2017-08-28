var global = (function() { return this })();
if (!('chai' in global)) {
  var chai = require('chai');
  var sinon = require('sinon');
  var assert = chai.assert;

  var module = require('../src/ready.js');
  var ready = new module.Ready();
};

describe('Ready', function() {

  it('結果が4となるか', function() {
    assert.equal(4, 4);
  });

});
