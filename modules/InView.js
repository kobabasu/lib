/**
 * InView 
 *
 * elementがブラウザ表示領域に入ったときにフェードイン
 *
 * @param {Object[]} options - 各オプションを指定
 * @param {string} options[].class='.inview' - 対象のクラスを指定
 * @param {number} options[].margin=0 - 開始するしきい値
 *
 * @return {void}
 */
(function(global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory(global));
  } else if (typeof exports === 'object') {
    module.exports = factory;
  } else {
    InView = factory(global);
  }
})((this || 0).self || global, function(global) {
  'use strict';

  var CLASS_NAME = '.inview';
  var TRIGGER_MARGIN = 0;

  function InView(options) {

    options = options || {} ;

    this._class = options['class'] || CLASS_NAME ;
    this._margin = options['margin'] || TRIGGER_MARGIN ;

    var els = document.querySelectorAll(this._class);
    this._els = Object.keys(els).map(function(key) {return els[key];});
    this._removeListener = null ;

    this.init();
  }

  InView.prototype = Object.create(Object.prototype, {
    'constructor': { 'value': InView },
    'init': { 'value': InView_init },
    'animate': { 'value': InView_animate },
    'remove': { 'value': InView_remove }
  });

  function InView_init() {
    for (var i = 0; i < this._els.length; i++) {
      this._els[i].eventParam = i;
      this._removeListener = this.remove.bind(this);
      this._els[i].addEventListener(
        'transitionend',
        this._removeListener,
        {passive: true}
      );
    }

    // 初期ロード時用
    this.animate();
  }

  function InView_animate() {
    var margin = this._margin;
    Object.keys(this._els).forEach(function(key) {
      var loc = this[key].getBoundingClientRect().top;
      if (global.innerHeight - loc > margin) {
        this[key].classList.add('active');
        delete this[key];
      }
    }, this._els);
  };

  function InView_remove(e) {
    e.target.removeEventListener(
      'transitionend',
      this._removeListener,
      {passive: true}
    );
  }

  return InView;
});
