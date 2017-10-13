/**
 * UpdateCopyright
 *
 * 'div.copyright span'内の年を動的に更新する
 *
 * @param {Object[]} options - 各オプションを指定
 * @param {string} options[].class='.copyright' - 対象となるクラス
 * @param {string} options[].thisyear=Date.getFullYear - 年を指定する
 * @param {string} options[].prefix=null - 年の前に表示する
 * @param {string} options[].debug=false - デバッグモード
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
    this._thisyear = options['thisyear'] || this.getThisyear();
    this._prefix = options['prefix'] || '';
    this._debug = options['debug'] || false ;
  }

  UpdateCopyright.prototype = Object.create(Object.prototype, {
    'constructor': { 'value': UpdateCopyright },
    'init': { 'value': UpdateCopyright_init },
    'log': { 'value': UpdateCopyright_log },
    'getThisyear': { 'value': UpdateCopyright_getThisyear },
    'change': { 'value': UpdateCopyright_change }
  });

  function UpdateCopyright_init() {
    try {
      const el = global.document.body
        .querySelector(this._class);

      el.innerHTML = this.change();
    } catch(e) {
      this.log(e);
    }
  }

  function UpdateCopyright_getThisyear() {
    return new Date().getFullYear();
  };

  function UpdateCopyright_change() {
    return this._prefix + this._thisyear;
  };

  function UpdateCopyright_log(e) {
    if (this._debug) {
      const msg = 'UpdateCopyright: ';
      console.log(msg + e);
    }
  }

  return UpdateCopyright;
});
