var assert = require('chai').assert;
var phantom = require('phantom');
var url = './test/InnerLink.test.html';
var src = './modules/InnerLink.js';
var _ph, _page;

describe('InnerLink', function() {

  it('結果が3となるか', function() {
    var promise = phantom.create().then(function(ph) {
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
      return _page.injectJs(src);
    }).then(function(loaded) {

      // evaluate start
      var change =  _page.evaluate(function() {

        new InnerLink();
        var btn = document.querySelector('#button');
        var el = document.querySelector('#bottom');

        var ev = document.createEvent('MouseEvents');
        ev.initEvent('click', true, true);
        btn.dispatchEvent(ev);

        //return window.scrollY;
      }).then(function(res) {
        assert.equal(res, 3);
      });

      return Promise.all([change]);
    });

    return promise;
  });

  after(function(done) {
    _page.close().then(function() {
      _ph.exit();
    });

    done();
  });
});
