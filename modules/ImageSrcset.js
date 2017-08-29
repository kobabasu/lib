/**
 * ImageSrcset
 *
 * 画像の先読み、遅延読み込み、retina変換
 *
 * @param {Object[]} options - 各オプションを指定
 * @param {string} options[].attr='data-original' - 対象となる属性
 * @param {string} options[].class-fit='.srcset-fit' - サイズを変更する対象
 * @param {string} options[].class-lazyload='.lazyload' - 遅延読み込み対象
 * @param {number} options[].margin=-300 - 読み込み開始のしきい値
 * @param {array} options[].threshhold - srcset-fitのしきい値とsuffix
 * @param {function} options[].loaded-without-lazyload - lazyload以外が完了時実行
 * @param {function} options[].complete - すべてが完了時実行
 *
 * @return {void}
 */
(function(global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory(global));
  } else if (typeof exports === 'object') {
    module.exports = factory(global);
  } else {
    ImageSrcset = factory(global);
  }
})((this || 0).self || global, function(global) {

  var ATTR_NAME = 'data-original';
  var CLASS_NAME_FIT = '.srcset-fit';
  var CLASS_NAME_LAZYLOAD = '.lazyload';
  var TRIGGER_MARGIN = -300;
  var THRESHHOLD = [
    { 'suffix': '-s',  'size': 767 },
    { 'suffix': '-l',  'size': 1280 },
    { 'suffix': '-xl', 'size': 1920 } 
  ];

  function ImageSrcset(options) {

    options = options || {} ;

    this._attr = options['attribute'] || ATTR_NAME ;
    this._classFit = options['class-fit'] || CLASS_NAME_FIT ;
    this._classLazy = options['class-lazyload'] || CLASS_NAME_LAZYLOAD ;
    this._margin = options['margin'] || TRIGGER_MARGIN;
    this._threshhold = options['threshhold'] || THRESHHOLD ;
    this._loadedWithoutLazyload = options['loaded-without-lazyload'] || function() {} ;
    this._complete = options['complete'] || function() {} ;

    this._min = this._threshhold.shift();
    this._max = this._threshhold.pop();
    this._dpx = global.windowDeviceRatio || 1 ;
    this._width = global.document.body.clientWidth ;

    this._els = null;
    this._css = null;
    this._elsLazy = null;
    this._cssLazy = null;
    this._totalWithoutLazyload = 0;
    this._total = 0;

    this.init();
  }

  ImageSrcset.prototype = Object.create(Object.prototype, {
    'constructor': { 'value': ImageSrcset },
    'init': { 'value': ImageSrcset_init },
    'change': { 'value': ImageSrcset_change },
    'lazyload': { 'value': ImageSrcset_lazyload },
    'loaded': { 'value': ImageSrcset_loaded }
  });

  function ImageSrcset_init() {
    var tgt, filename, path;

    tgt = ':not(' + this._classLazy + ')[' + this._attr + ']';
    this._els = global.document.body.querySelectorAll(tgt);

    tgt = ':not(' + this._classLazy + ')[' + this._attr + '-background]';
    this._css = global.document.body.querySelectorAll(tgt);

    for (var i = 0; i < this._els.length; i++) {
      this.change(this._els[i], true);
    }

    for (var i = 0; i < this._css.length; i++) {
      this.change(this._css[i], false);
    }

    tgt = this._classLazy + '[' + this._attr + ']';
    var elsLazy = global.document.body.querySelectorAll(tgt);
    this._elsLazy = Object.keys(elsLazy)
      .map(function(key) { return elsLazy[key];});

    tgt = this._classLazy + '[' + this._attr + '-background]';
    var cssLazy = global.document.body.querySelectorAll(tgt);
    this._cssLazy = Object.keys(cssLazy)
      .map(function(key) { return cssLazy[key];});

    this._totalWithoutLazyload = (
      this._els.length +
      this._css.length
    );

    this._total = (
      this._totalWithoutLazyload +
      this._elsLazy.length +
      this._cssLazy.length
    );

    this.lazyload();
  }

  function ImageSrcset_change(el, flag) {
    var original, filename, path;
    if (flag) {
      original = el.getAttribute(this._attr);
    } else {
      original = el.getAttribute(this._attr + '-background');
    }
    var str = _parse(original);

    if (str.extention.match(/^(gif|jpeg|jpg|png)$/)) {
      if (el.classList.contains(this._classFit.slice(1))) {
        filename = _detectWidth(
          this._min,
          this._max,
          this._threshhold,
          str.name
        );
      } else {
        filename = str.name;
      }

      filename = _detectDpx(filename);
      path = str.dir + filename + '.' + str.extention;

      var img = new Image();
      img.onload = function() {
        if (flag) {
          el.src = path;
        } else {
          el.style.backgroundImage = 'url(' + path + ')';
        }
        this.loaded();
      }.bind(this);

      img.onerror = function() {
        if (flag) {
          el.src = original;
        } else {
          el.style.backgroundImage = 'url(' + original + ')';
        }
      };

      img.src = path;
    }
  }

  function ImageSrcset_lazyload() {
    Object.keys(this._elsLazy).forEach(function(key) {
      var loc = this._elsLazy[key].getBoundingClientRect().top;
      if (global.innerHeight - loc > this._margin) {
        this.change(this._elsLazy[key], true);
        delete this._elsLazy[key];
      } 
    }.bind(this));

    Object.keys(this._cssLazy).forEach(function(key) {
      var loc = this._cssLazy[key].getBoundingClientRect().top;
      if (global.innerHeight - loc > this._margin) {
        this.change(this._cssLazy[key], false);
        delete this._cssLazy[key];
      } 
    }.bind(this));
  }

  function ImageSrcset_loaded() {
    this._totalWithoutLazyload--;
    this._total--;

    if (this._totalWithoutLazyload == 0) {
      this._loadedWithoutLazyload();
    }

    if (this._total == 0) {
      this._complete();
    }
  }

  function _detectWidth(min, max, threshhold, name) {
    var width = global.document.body.clientWidth;
    var suffix = '';

    if (threshhold.length > 0) {
      if (width <= min.size) {
        suffix = min.suffix;
      } else if (width >= max.size) {
        suffix = max.suffix;
      } else {
        threshhold.forEach(function(obj) {
          if (width > obj.size) {
            suffix = obj.suffix;
          }
        });
      }
    }

    return name + suffix;
  }

  function _detectDpx(name) {
    var dpx = global.windowDeviceRatio;
    var suffix = '';

    if (dpx <= 1) {
      suffix = '';
    } else if (dpx > 2) {
      suffix = '@3x';
    } else {
      suffix = '@2x';
    };

    return name + suffix;
  }

  function _parse(attr) {
    var filename = attr.split('/').pop();
    var arr = filename.split('.');

    return {
      dir: attr.replace(filename, '') || '',
      name: arr[0].replace(/\@.*$/, '') || '',
      extention: arr[1] || ''
    };
  }

  return ImageSrcset;  
});
