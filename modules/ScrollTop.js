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
  var TRACKED_ELEMENT = 'footer';
  var MARGIN = 5;

  function ScrollTop(options) {

    options = options || {} ;

    this._class = options['class'] || CLASS_NAME ;
    this._tracked = options['tracked'] || TRACKED_ELEMENT ;
  }

  ScrollTop.prototype = Object.create(Object.prototype, {
    'constructor': { 'value': ScrollTop },
    'init': { 'value': ScrollTop_init },
    'animate': { 'value': ScrollTop_animate }
  });

  function ScrollTop_init() {
    this._target = global.document.querySelector(this._class);
    this._trackedElement = global.document
      .querySelector(this._tracked);

    this._target.style.position = 'fixed';
    this._target.style.zIndex = 9999;
  }

  function ScrollTop_animate() {
    var pos = global.innerHeight - this._trackedElement
      .getBoundingClientRect().top;

    if (pos > 0) {
      this._target.style.bottom = pos + MARGIN + 'px';
    } else {
      this._target.style.bottom = MARGIN + 'px';
    };
  }

  return ScrollTop;
});
