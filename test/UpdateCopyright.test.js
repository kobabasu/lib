var assert = require('chai').assert;
var phantom = require('phantom');
var url = './test/UpdateCopyright.test.html';
var src = './modules/UpdateCopyright.js';
var _ph, _page;

describe('UpdateCopyright', function() {

  it('クラスが見つからない場合なにも変更しないか', function() {
    var promise = phantom.create().then(function(ph) {
      _ph = ph;
      return ph.createPage();
    }).then(function(page) {
      _page = page;
      return _page.open(url);
    }).then(function(status) {
      return _page.injectJs(src);
    }).then(function(loaded) {

      // evaluate start
      var change =  _page.evaluate(function() {
        var el = document.querySelector('.copyright');
        el.classList.remove('copyright');
        el.classList.add('copyrights');
        var module = new UpdateCopyright({thisyear: '2017'});
        module.init();
        return el.innerHTML;
      }).then(function(res) {
        assert.equal(res, '2016');
      });

      return Promise.all([change]);
    });

    return promise;
  });


  it('2017に変更されているか', function() {
    var promise = phantom.create().then(function(ph) {
      _ph = ph;
      return ph.createPage();
    }).then(function(page) {
      _page = page;
      return _page.open(url);
    }).then(function(status) {
      return _page.injectJs(src);
    }).then(function(loaded) {

      // evaluate start
      var change =  _page.evaluate(function() {
        var module = new UpdateCopyright();
        module.init();
        var el = document.querySelector('.copyright');
        return el.innerHTML;
      }).then(function(res) {
        assert.equal(res, '2017');
      });

      return Promise.all([change]);
    });

    return promise;
  });


  it('prefixがきちんと付加されるか', function() {
    var promise = phantom.create().then(function(ph) {
      _ph = ph;
      return ph.createPage();
    }).then(function(page) {
      _page = page;
      return _page.open(url);
    }).then(function(status) {
      return _page.injectJs(src);
    }).then(function(loaded) {

      // evaluate start
      var change =  _page.evaluate(function() {
        var module = new UpdateCopyright({prefix: '2013-'});
        module.init();
        var el = document.querySelector('.copyright');
        return el.innerHTML;
      }).then(function(res) {
        assert.equal(res, '2013-2017');
      });

      return Promise.all([change]);
    });

    return promise;
  });


  it('指定の年に固定できるか', function() {
    var promise = phantom.create().then(function(ph) {
      _ph = ph;
      return ph.createPage();
    }).then(function(page) {
      _page = page;
      return _page.open(url);
    }).then(function(status) {
      return _page.injectJs(src);
    }).then(function(loaded) {

      // evaluate start
      var change =  _page.evaluate(function() {
        var module = new UpdateCopyright({thisyear: '2001'});
        module.init();
        var el = document.querySelector('.copyright');
        return el.innerHTML;
      }).then(function(res) {
        assert.equal(res, '2001');
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
