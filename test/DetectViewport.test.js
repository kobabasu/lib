var global = (function() { return this })();
if (!('chai' in global)) {
  var chai = require('chai');
  var sinon = require('sinon');
  var assert = chai.assert;

  var module = require('../modules/DetectViewport.js');
  // var updateCopyright = new module.UpdateCopyright();
};


describe('DetectViewport', function() {

  before(function(done) {
    done();
  });

  it('結果が4であるか', function() {
    assert.equal(4, 4);
  });
});
