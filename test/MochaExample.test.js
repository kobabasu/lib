var global = (function() { return this })();
if (!('chai' in global)) {
  var chai = require('chai');
  var sinon = require('sinon');
  var assert = chai.assert;

  var module = require('../src/mocha-example.js');
  var mochaExample = new module.MochaExample();
};

describe('MochaExample', function() {

  it('結果が3となるか', function() {
    assert.equal(mochaExample.change(), 3);
  });

});
