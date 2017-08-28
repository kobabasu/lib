var global = (function() { return this })();
if (!('chai' in global)) {
  var chai = require('../vendor/chai/chai.js');
  var sinon = require('sinon');
  var assert = chai.assert;

  var module = require('../src/mocha-example.js');
  var mochaExampleTwo = new module.MochaExampleTwo();
};

describe('MochaExampleTwo', function() {

  it('結果が4となるか', function() {
    assert.equal(mochaExampleTwo.change(), 4);
  });

});
