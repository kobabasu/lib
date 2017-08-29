/**
 * ScrollIt
 *
 * スクロールに合わせ背景画像をアニメーション
 *
 * @param {Object[]} options - 各オプションを指定
 * @param {string} options[].class='.scrollit' - 対象のクラス名を指定
 * @param {number} options[].margin=50 - スクロール開始する前のpx数
 *
 * @return {void}
 */
(function(global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory(global));
  } else if (typeof exports === 'object') {
    module.exports.ScrollIt = factory(global);
  } else {
    ScrollIt = factory(global);
  }
})((this || 0).self || global, function(global) {
  'use strict';

  var CLASS_NAME = '.scrollit';
  var TRIGGER_MARGIN = 50;

  function ScrollIt(options) {

    options = options || {} ;

    this._class = options['class'] || CLASS_NAME ;
    this._margin = options['margin'] || TRIGGER_MARGIN ;
    this._els = { 'up': [], 'down': [], 'left': [], 'right': [] };
  };

  ScrollIt.prototype = Object.create(Object.prototype, {
    'constructor': { 'value': ScrollIt },
    'init': { 'value': ScrollIt_init },
    'animate': { 'value': ScrollIt_animate }
  });

  function ScrollIt_init() {
    var els = global.document.body
      .querySelectorAll('[class*="' + this._class.slice(1) + '"]');

    var exp = new RegExp(this._class + '-([a-z]*)\s*');

    for (var i = 0; i < els.length; i++) {
      var direction = els[i].className
        .match(exp)[1];

      switch (direction) {
        case 'down':
          this._els['down'].push(els[i]);
          break;
        case 'left':
          this._els['left'].push(els[i]);
          break;
        case 'right':
          this._els['right'].push(els[i]);
          break;
        default:
          this._els['up'].push(els[i]);
          break;
      }
    }
  }

  function ScrollIt_animate() {
    var limit = this._margin * 2;
    var height = global.innerHeight;
      
    for (var i = 0; i < this._els['up'].length; i++) {
      var loc = this._els['up'][i].getBoundingClientRect();
      var dis = limit - loc.top / height * this._margin;
      if (0 < dis && 100 > dis) {
        this._els['up'][i].style.backgroundPositionY = dis + '%';
      }
    };

    for (var i = 0; i < this._els['down'].length; i++) {
      var loc = this._els['down'][i].getBoundingClientRect();
      var dis = loc.top / height * this._margin;
      if (0 < dis && 100 > dis) {
        this._els['down'][i].style.backgroundPositionY = dis + '%';
      }
    };

    for (var i = 0; i < this._els['left'].length; i++) {
      var loc = this._els['left'][i].getBoundingClientRect();
      var dis = loc.top / height * this._margin;
      if (0 < dis && 100 > dis) {
        this._els['left'][i].style.backgroundPositionX = dis + '%';
      }
    };

    for (var i = 0; i < this._els['right'].length; i++) {
      var loc = this._els['right'][i].getBoundingClientRect();
      var dis = limit - loc.top / height * this._margin;
      if (0 < dis && 100 > dis) {
        this._els['right'][i].style.backgroundPositionX = dis + '%';
      }
    };
  }

  return ScrollIt;
});
