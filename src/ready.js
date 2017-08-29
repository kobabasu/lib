/**
 * ready.js
 * @file Initial Connectionでロードされるクラス
 */


/**
 * Ready
 *
 * contentの読み込みを待つ
 * ローディング画面を表示しoptionでdelayを加えるとloading画面を表示
 * loading画面はcomplete時のみ。DOMContentLoaded後は発火しない
 *
 * @param {Object[]} options - 各オプションを指定
 * @param {string} options[].class='.loading' - ローディング画面のdivを指定
 * @param {string} options[].text='&nbsp;loading...' - ローディング画面の文字
 * @param {number} options[].duration=1000 - ローディング画面を表示する長さ
 * @param {number} options[].delay=300 - loadging画面で止まる長さ 0はloading画面をなくす
 * @param {object[]} options[].preload - 先読みするもの
 * @param {array} options[].preload[].img - 先読みする画像
 * @param {function} options[].interactive - DOMContentLoadedの発火後に実行
 * @param {function} options[].complete - loadの発火後に実行
 * @param {function} options[].scroll - scroll時に実行
 * @param {function} options[].resize - resize時に実行
 *
 * @return {void}
 */
(function(global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory(global));
  } else if (typeof exports === 'object') {
    module.exports.Ready = factory(global);
  } else {
    Ready = factory(global);
  }
})((this || 0).self || global, function(global) {
  'use strict';

  var CLASS_NAME = '.loading' ;
  var LOADING_TEXT = '&nbsp;loading...';
  var DURATION = 1000 ;
  var DELAY = 0 ;

  function Ready(options) {

    options = options || {} ;

    this._class = options['class'] || CLASS_NAME ;
    this._text = options['text'] || LOADING_TEXT ;
    this._duration = options['duration'] || DURATION ;
    this._delay = options['delay'] || DELAY ;
    this._flag = (this._delay == 0) ? false : true ;
    this._preload = options['preload'] || { 'img': [] } ;
    this._interactive = options['interactive'] || function() {} ;
    this._complete = options['complete'] || function() {} ;
    this._scroll = options['scroll'] || function() {} ;
    this._resize = options['resize'] || function() {} ;

    this._el = null ;
    this._interactiveListener = null ;
    this._completeListener = null ;
    this._removeListener = null ;
  }

  Ready.prototype = Object.create(Object.prototype, {
    'constructor': { 'value': Ready },
    'init': { 'value': Ready_init },
    'create': { 'value': Ready_create },
    'remove': { 'value': Ready_remove },
    'transition': { 'value': Ready_transition },
    'preload': { 'value': Ready_preload },
    'interactive': { 'value': Ready_interactive },
    'complete': { 'value': Ready_complete },
    'scroll': { 'value': Ready_scroll },
    'resize': { 'value': Ready_resize },
    'enable': { 'value': Ready_enable },
    'disable': { 'value': Ready_disable }
  });

  function Ready_init() {
    this.preload();

    this._interactiveListener = this.interactive.bind(this);
    global.document.addEventListener(
      'DOMContentLoaded',
      this._interactiveListener,
      {passive: true}
    );

    this._completeListener = this.complete.bind(this);
    global.addEventListener(
      'load',
      this._completeListener,
      {passive: true}
    );
  };

  function Ready_create() {
    this._el = global.document.createElement('div');
    this._el.classList.add(this._class.slice(1));
    var p = global.document.createElement('p');
    p.innerHTML = this._text;
    this._el.appendChild(p);

    this._removeListener = this.remove.bind(this);
    this._el.addEventListener(
      'transitionend',
      this._removeListener,
      {passive: true}
    );

    global.document.body.insertBefore(
      this._el,
      global.document.body.firstChild
    );
  }

  function Ready_remove() {
    this._el.removeEventListener(
      'transitionend',
      this._removeListener,
      {passive: true}
    );
    global.document.body.removeChild(this._el);
  };

  function Ready_transition() {
    this._el.classList.add('loaded');
  };

  function Ready_preload() {
    for (var i = 0; i < this._preload.img.length; i++) {
      var img = new Image();
      img.src = this._preload.img[i];
    }
  }

  function Ready_interactive() {
    global.document.removeEventListener(
      'DOMContentLoaded',
      this._interactiveListener,
      {passive: true}
    );

    if (this._flag) {
      this.create();
    }

    this._interactive();
  };

  function Ready_complete() {
    global.removeEventListener(
      'load',
      this._completeListener,
      {passive: true}
    );

    this._complete();

    this.scroll();
    this.resize();

    if (this._flag) {
      setTimeout(this.transition.bind(this), this._delay);
    }
  }

  function Ready_scroll() {
    this._scroll.flag = true;
    global.addEventListener(
      'scroll',
      function() {
        if (this._scroll.flag) {
          this._scroll.flag = false;
          setTimeout(function() {
            this._scroll();
            this._scroll.flag = true;
          }.bind(this), 300);
        }
      }.bind(this),
      {passive: true}
    );
  }

  function Ready_resize() {
    this._resize.flag = true;
    global.addEventListener(
      'resize',
      function() {
        if (this._resize.flag) {
          this._resize.flag = false;
          setTimeout(function() {
            this._resize();
            this._resize.flag = true;
          }.bind(this), 300);
        }
      }.bind(this),
      {passive: true}
    );
  }

  /**
   * enable
   * HTML側からloading画面を表示させる
   * @param {number} [delay=300] - 表示時間を指定
   */
  function Ready_enable(delay) {
    this._flag = true;
    this._delay = delay || 300;
  }

  /**
   * disable
   * HTML側からloading画面を表示させないようにする
   */
  function Ready_disable() {
    this._flag = false;
  }

  return Ready;
});
