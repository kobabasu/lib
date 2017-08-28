/**
 * ScrollTop
 *
 * @param {Object[]} options - 各オプションを指定
 * @param {string} options[].class='.scrolltop' - スクロールアイコンのクラス
 *
 * @return {void}
 */
(function(global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory(global));
  } else if (typeof exports === 'object') {
    module.exports = factory(global);
  } else {
    ScrollTop = factory(global);
  }
})((this || 0).self || global, function(global) {
  'use strict';

  var CLASS_NAME = '.scrolltop';
  var MARGIN_BOTTOM_ELEMENT = 'footer';
  var DISTANCE = 5;

  function ScrollTop(options) {

    options = options || {} ;

    this._class = options['class'] || CLASS_NAME ;
    this._target = global.document.querySelector(this._class);
    this._bottomElement = global.document
      .querySelector(MARGIN_BOTTOM_ELEMENT);
  }

  ScrollTop.prototype = Object.create(Object.prototype, {
    'constructor': { 'value': ScrollTop },
    'animate': { 'value': ScrollTop_animate }
  });

  function ScrollTop_animate() {
    var pos = global.innerHeight - this._bottomElement
      .getBoundingClientRect().top;

    if (pos > 0) {
      this._target.style.bottom = pos + DISTANCE + 'px';
    } else {
      this._target.style.bottom = DISTANCE + 'px';
    };
    this._target.style.zIndex = 9999;
  }

  return ScrollTop;
});
