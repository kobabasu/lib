var assert = require('chai').assert;
var phantom = require('phantom');
var url = './test/test.html';

describe('DetectViewport', function() {

  it('ブラウザの幅が1920pxか', function() {
    var promise = phantom.create().then(function(ph) {
      return ph.createPage().then(function(page) {

        page.property('viewportSize', {
          width: 1920,
          height: 1080
        });

        return page.open(url).then(function(status) {

          page.property('viewportSize', {
            width: 1920,
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

            assert.equal(html, 1920);

            page.close().then(function() {
              ph.exit();
            });
          });
        });
      });
    });
    return promise;
  });

});
