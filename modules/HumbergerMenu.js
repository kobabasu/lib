/**
 * HumbergerMenu
 *
 * SP表示時のハンバーガーメニューを表示・非表示
 *
 * @param {Object[]} options - 各オプションを指定
 * @param {string} options[].class='glbalnav.humberger' - メニューのタグを指定
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
    HumbergerMenu = factory(global);
  }
})((this || 0).self || global, function(global) {
  'use strict';

  var CLASS_NAME = '.globalnav.humberger';
  var APPEND_CLASS_NAME_ACTIVE = 'humberger-active';
  var APPEND_CLASS_NAME_ICON = 'humberger-icon';

  function HumbergerMenu(options) {

    options = options || {} ;

    this._class = options['class'] || CLASS_NAME ;

    this.attach();
  }

  HumbergerMenu.prototype = Object.create(Object.prototype, {
    'constructor': { 'value': HumbergerMenu },
    'attach': { 'value': HumbergerMenu_attach }
  });

  function _generate() {
    var el = document.createElement('div');
    el.className = APPEND_CLASS_NAME_ICON;

    return el;
  }

  function HumbergerMenu_attach() {
    if (global.document.querySelector(CLASS_NAME)) {
      var icon = _generate();
      var nav = global.document.querySelector(CLASS_NAME);
      nav.parentNode.insertBefore(icon, nav.nextElementSibling);

      icon.addEventListener(
        'click',
        function() {
          global.document.body.classList.toggle(APPEND_CLASS_NAME_ACTIVE);
          global.document.getElementsByTagName('header')[0]
            .classList.toggle(APPEND_CLASS_NAME_ACTIVE);
          nav.classList.toggle(APPEND_CLASS_NAME_ACTIVE);
          icon.classList.toggle(APPEND_CLASS_NAME_ACTIVE);
        },
        {passive: true});
    }
  }

  return HumbergerMenu;
});
