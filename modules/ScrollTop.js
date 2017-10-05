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
  }

  ScrollTop.prototype = Object.create(Object.prototype, {
    'constructor': { 'value': ScrollTop },
    'init': { 'value': ScrollTop_init },
    'animate': { 'value': ScrollTop_animate }
  });

  function ScrollTop_init() {
    this._target = global.document.querySelector(this._class);
    this._bottomElement = global.document
      .querySelector(MARGIN_BOTTOM_ELEMENT);

    this._target.style.zIndex = 9999;
  }

  function ScrollTop_animate() {
    var pos = global.innerHeight - this._bottomElement
      .getBoundingClientRect().top;

    if (pos > 0) {
      this._target.style.bottom = pos + DISTANCE + 'px';
    } else {
      this._target.style.bottom = DISTANCE + 'px';
    };
  }

  return ScrollTop;
});
