/**
 * RippleEffect
 *
 * ripple effectを追加する
 * APPEND_CLASS_NAMEを変更した場合はcss側も調整が必要
 *
 * @param {Object[]} options - 各オプションを指定
 * @param {string} opotions[].class='.ripple' - 付加するクラスを指定する
 *
 * @return {void}
 */
(function(factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    RippleEffect = factory();
  }
})(function() {
  'use strict';

  var CLASS_NAME = '.ripple';
  var APPEND_CLASS_NAME = 'ripple-effect';

  function RippleEffect(options) {

    options = options || {};

    this._class = options['class'] || CLASS_NAME ;
  }

  RippleEffect.prototype = Object.create(Object.prototype, {
    'constructor': { 'value': RippleEffect },
    'init': { 'value': RippleEffect_init }
  });

  function RippleEffect_init() {
    var els = document.querySelectorAll(this._class);

    if (els.length) return;

    for (var i = 0; i < els.length; i++) {
      _append(els[i]);
    }
  }

  function _generate() {
    var fx = document.createElement('span');
    fx.className = APPEND_CLASS_NAME;

    return fx;
  }

  function _append(el) {
    el.addEventListener('mousedown', function(e) {
      _add(e, el);
    }, {passive: true});
  }

  function _add(e, el) {
    var fx = _generate();
    el.appendChild(fx);

    var x = e.offsetX;
    var y = e.offsetY;
    var w = fx.clientWidth;
    var h = fx.clientHeight;

    fx.style.left = x - w / 2 + 'px';
    fx.style.top = y - h / 2 + 'px';

    fx.addEventListener(
      'animationend',
      _remove,
      {passive: true}
    );
    fx.classList.add('active');
  }

  function _remove(e) {
    var fx = e.target;
    fx.removeEventListener(
      'aniimationend',
      _remove,
      {passive: true}
    );
    fx.parentNode.removeChild(fx);
  }

  return RippleEffect;
});
