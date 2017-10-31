/**
 * SlideMenu
 *
 * SP表示時のスライドメニューを表示・非表示
 *
 * @param {Object[]} options - 各オプションを指定
 * @param {string} options[].class='glbalnav.slidemenu' - メニューのタグを指定
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
    SlideMenu = factory(global);
  }
})((this || 0).self || global, function(global) {
  'use strict';

  var CLASS_NAME = '.globalnav.slidemenu';
  var APPEND_CLASS_NAME_ACTIVE = 'slidemenu-active';
  var APPEND_CLASS_NAME_ICON = 'slidemenu-icon';

  function SlideMenu(options) {

    options = options || {};

    this._class = options['class'] || CLASS_NAME ;

    this.attach();
  }

  SlideMenu.prototype = Object.create(Object.prototype, {
    'constructor': { 'value': SlideMenu },
    'attach': { 'value': SlideMenu_attach }
  });

  function _generate() {
    var el = global.document.createElement('div');
    el.className = APPEND_CLASS_NAME_ICON;

    return el;
  }

  function SlideMenu_attach() {
    if (global.document.querySelector(CLASS_NAME)) {
      var icon = _generate();
      var nav = global.document.querySelector(CLASS_NAME);
      nav.parentNode.insertBefore(icon, nav.nextElementSibling);

      icon.addEventListener(
        'click',
        function() {
          nav.style.opacity = 1;
          nav.classList.toggle(APPEND_CLASS_NAME_ACTIVE);
        },
        {passive: true}
      );
    }
  }

  return SlideMenu;
});
