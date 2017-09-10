var assert = require('chai').assert;
var sinon = require('sinon');
var phantom = require('phantom');
var url = './DetectViewport.test.html';
var src = './modules/DetectViewport.js';
var _ph, _page;

describe('DetectViewport', function() {

  it('ブラウザ幅766pxでtrueとなるか', function() {
    var promise = phantom.create().then(function(ph) {
      _ph = ph;
      return ph.createPage();
    }).then(function(page) {
      _page = page;

      _page.property('viewportSize', {
        width: 766,
        height: 1080
      });

      return _page.open(url);
    }).then(function(status) {
      return _page.injectJs(src);
    }).then(function(loaded) {

      // evaluate start
      var change =  _page.evaluate(function() {
        var module = new DetectViewport({
          name: 'sp',
          viewport: '(max-width: 767px)'
        });

        return module.getStatus();
      }).then(function(res) {
        assert.isTrue(res);
      });

      return Promise.all([change]);
    });

    return promise;
  });


  it('ブラウザ幅767pxでtrueとなるか', function() {
    var promise = phantom.create().then(function(ph) {
      _ph = ph;
      return ph.createPage();
    }).then(function(page) {
      _page = page;

      _page.property('viewportSize', {
        width: 767,
        height: 1080
      });

      return _page.open(url);
    }).then(function(status) {
      return _page.injectJs(src);
    }).then(function(loaded) {

      // evaluate start
      var change =  _page.evaluate(function() {
        var module = new DetectViewport({
          name: 'sp',
          viewport: '(max-width: 767px)'
        });

        return module.getStatus();
      }).then(function(res) {
        assert.isTrue(res);
      });

      return Promise.all([change]);
    });

    return promise;
  });


  it('ブラウザ幅768pxでfalseとなるか', function() {
    var promise = phantom.create().then(function(ph) {
      _ph = ph;
      return ph.createPage();
    }).then(function(page) {
      _page = page;

      _page.property('viewportSize', {
        width: 768,
        height: 1080
      });

      return _page.open(url);
    }).then(function(status) {
      return _page.injectJs(src);
    }).then(function(loaded) {

      // evaluate start
      var change =  _page.evaluate(function() {
        var module = new DetectViewport({
          name: 'sp',
          viewport: '(max-width: 767px)'
        });

        return module.getStatus();
      }).then(function(res) {
        assert.isFalse(res);
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
