var assert = require('chai').assert;
var phantom = require('phantom');
var url = './MochaExample.test.html';
var _ph, _page;

describe('MochaExample', function() {

  it('ブラウザの幅が1920pxか', function() {
    return phantom.create().then(function(ph) {
      _ph = ph;
      return ph.createPage();
    }).then(function(page) {
      _page = page;
      _page.property('viewportSize', {
        width: 1920,
        height: 1080
      });

      return _page.open(url);
    }).then(function(status) {
      return _page.evaluate(function() {
        return window.innerWidth;
      });
    }).then(function(html) {
      _page.close().then(function() {
        _ph.exit();
      });

      assert.equal(html, 1920);
    });
  });

});
