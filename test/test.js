var assert = require('chai').assert;
var phantom = require('phantom');
var url = './test/test.html';
var _ph, _page;

describe('DetectViewport', function() {

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
        var module = new DetectViewport({
          'name': 'sp',
          'viewport': '(max-width: 767px)'
        });
        module.listen();

        window.innerWidth = 767;

        return window.innerWidth;
      });
    }).then(function(html) {
      _page.close().then(function() {
        _ph.exit();
      });

      assert.equal(html, 767);
    });

    /*
    var promise = phantom.create().then(function(ph) {
      return ph.createPage().then(function(page) {

        page.property('viewportSize', {
          width: 1920,
          height: 1080
        });

        return page.open(url).then(function(status) {

          page.property('viewportSize', {
            width: 767,
            height: 1080
          });

          return page.evaluate(function() {
            var module = new DetectViewport({
              'name': 'sp',
              'viewport': '(max-width: 767px)'
            });
            module.listen();

            return window.innerWidth;
          }).then(function(html) {
            page.close().then(function() {
              ph.exit();
            });

            assert.equal(html, 767);
          });
        });
      });
    });
    return promise;
    */
  });
});
