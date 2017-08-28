var global = (function() { return this })();
if (!('chai' in global)) {
  var chai = require('chai');
  var sinon = require('sinon');
  var assert = chai.assert;

  var module = require('../js/dom.js');
  var updateCopyright = new module.UpdateCopyright();
};

describe('DOM:UpdateCopyright', function() {

  var el;

  before(function(done) {
    el = global.document.body.querySelector('.copyright');
    el.classList.remove('copyright');
    done();
  });

  it('クラスがなくともエラーが発生しないか', function() {
    assert.doesNotThrow(updateCopyright.init.bind(this), Error);
  });

  after(function(done) {
    el.classList.add('copyright');
    done();
  });
});


describe('DOM:UpdateCopyright', function() {

  it('正しく今年が表示されるか', function() {
    var el = global.document.body.querySelector('.copyright');
    updateCopyright.init();
    var ans = new Date().getFullYear();
    assert.equal(el.innerHTML, ans);
  });
});
