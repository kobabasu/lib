/**
 * Toogle
 *
 * .toogleがついているエレメントをクリックのたび、
 * クラスをつけたり、消したりする
 * classに.with-value-changeをつけると文字も変える
 *
 * Example:
 * <a href="#"
 *   class="toggle with-value-change"
 *   data-default="red" // クリック前の文字
 *   data-active="blue" // クリック後の文字
 *   >red</a>
 *
 * @param {string} options[].debug=false - デバッグモード
 *
 * @return {void}
 */
(function(global, factory) {
  /* istanbul ignore next */
  if (typeof define === 'function' && define.amd) {
    define(factory(global));
  } else if (typeof exports === 'object') {
    module.exports = factory(global);
  } else {
    Toggle = factory(global);
  }
})((this || 0).self || global, function(global) {
  'use strict';

  var CLASS_NAME = '.toggle';
  var APPEND_CLASS_NAME_ACTIVE = 'toggle-active';
  var VALUE_CHANGE_NAME = 'with-change-value';

  function Toggle(options) {

    options = options || {};

    this._class = options['class'] || CLASS_NAME ;
    this._debug = options['debug'] || false ;
  }

  Toggle.prototype = Object.create(Object.prototype, {
    'constructor': { 'value': Toggle },
    'init': { 'value': Toggle_init },
    'attach': { 'value': Toggle_attach },
    'log': { 'value': Toggle_log }
  });

  function Toggle_init() {
    try {
      var els = global.document
        .querySelectorAll(CLASS_NAME);

      if (els.length > 0) {
        for (var i = 0; i < els.length; i++) {
          els[i].addEventListener(
            'click',
            this.attach,
            {passive: true}
          );
        }
      } else {
        this.log("'.toggle' not found.");
        return undefined;
      }
    } catch(e) {
      this.log(e);
    }
  }

  function Toggle_attach() {
    this.classList.toggle(APPEND_CLASS_NAME_ACTIVE);

    if (this.classList.contains(VALUE_CHANGE_NAME)) {
      _change(this);
    }
  }

  function _change(el) {
    var def = el.getAttribute('data-default', 'value');
    var act = el.getAttribute('data-active', 'value');

    if (el.classList.contains(APPEND_CLASS_NAME_ACTIVE)) {
      el.innerHTML = act;
    } else {
      el.innerHTML = def;
    }
  }

  function Toggle_log(e) {
    if (this._debug) {
      var msg = 'Toggle: ';
      console.log(msg + e);
    }
  };

  return Toggle;
});
