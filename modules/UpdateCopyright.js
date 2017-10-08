/**
 * UpdateCopyright
 *
 * 'div.copyright span'内の年を動的に更新する
 *
 * @param {Object[]} options - 各オプションを指定
 * @param {string} options[].class='.copyright' - 対象となるクラス
 * @param {string} options[].thisyear=Date.getFullYear - 年を指定する
 * @param {string} options[].prefix=null - 年の前に表示する
 *
 * @return {void}
 */
(function(global, factory) {
  /* istanbul ignore next */
  if (typeof define === 'function' && define.amd) {
    define(factory(global));
  } else if (typeof exports === 'object') {
    module.exports.UpdateCopyright = factory(global);
  } else {
    UpdateCopyright = factory(global);
  }
})((this || 0).self || global, function(global) {
  'use strict';

  var CLASS_NAME = '.copyright';

  /* istanbul ignore next */
  function UpdateCopyright(options) {
    
    options = options || {};

    this._class = options['class'] || CLASS_NAME ;
    this._thisyear = options['thisyear'] || _getThisyear();
    this._prefix = options['prefix'] || '';
  }

  UpdateCopyright.prototype = Object.create(Object.prototype, {
    'constructor': { 'value': UpdateCopyright },
    'init': { 'value': UpdateCopyright_init }
  });

  function UpdateCopyright_init() {
    var el = global.document.body
      .querySelector(this._class);

    if (!el) return;

    _change(el, this._prefix, this._thisyear);
  }

  function _getThisyear() {
    return new Date().getFullYear();
  };

  /* istanbul ignore next */
  function _change(el, prefix, year) {
    el.innerHTML = prefix + year;
  };

  return UpdateCopyright;
});
