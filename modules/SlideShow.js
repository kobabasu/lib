/**
 * SlideShow
 *
 * slideshowを表示
 * 
 * @param {Object[]} options - 各オプションを指定
 * @param {string} options[].class='.slideshow' - 対象のクラスを指定
 * @param {number} options[].duration=3000 - 表示間隔 ms
 * @param {number} options[].total=120 - 表示階数
 *
 * @return {void}
 */
(function(global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory(global));
  } else if (typeof exports === 'object') {
    module.exports = factory;
  } else {
    SlideShow = factory(global);
  }
})((this || 0).self || global, function(global) {
  'use strict';

  var CLASS_NAME = '.slideshow';
  var DURATION = 3000;
  var TOTAL_COUNTS = 120;

  function SlideShow(options) {

    options = options || {} ;

    this._class = options['class'] || CLASS_NAME ;
    this._duration = options['duration'] || DURATION ;
    this._total = options['total'] || TOTAL_COUNTS ;

    this._items = null;
    this._container = null;
    this._ul = null;
    this._forward = null;
    this._prev = null;

    this._flag = true;
    this._count = 0;
    this._now = 0;
    this._next = 1;
    this._timer = null;
    this._dots = []; 
    this._removeListener = null;

    this.init();
  }

  SlideShow.prototype = Object.create(Object.prototype, {
    'constructor': { 'value': SlideShow },
    'init': { 'value': SlideShow_init },
    'createBackGround': { 'value': SlideShow_createBackGround },
    'createDot': { 'value': SlideShow_createDot },
    'start': { 'value': SlideShow_start },
    'loop': { 'value': SlideShow_loop },
    'remove': { 'value': SlideShow_remove },
    'click': { 'value': SlideShow_click }
  });

  function SlideShow_init() {

    this._items = document
      .querySelectorAll('[class*="' + this._class.slice(1) + '-item-"]');

    this._container = document.querySelector(this._class);
    this._ul = document.querySelector(this._class + ' > ul:nth-of-type(1)');
    this.createBackGround();
    this._forward = document.querySelector(this._class + '-forward');
    this._prev = document.querySelector(this._class + '-prev');
    this.createDot();

    // for ios safari overflow-x issue
    this._ul.style.position = 'relative';
    this._ul.style.overflow = 'visible';
    this._ul.style.width = '100%';

    this._forward.eventParam = 'forward';
    this._forward.addEventListener(
      'click',
      this.click.bind(this),
      {passive: true}
    );

    this._prev.eventParam = 'prev';
    this._prev.addEventListener(
      'click',
      this.click.bind(this),
      {passive: true}
    );
  };

  function SlideShow_createBackGround() {
    var bg = this._items[0].cloneNode(true);
    bg.style.marginLeft = 0;
    bg.style.zIndex = 1;

    var el = bg.childNodes[1];
    el.style.opacity = 1;

    this._ul.appendChild(bg);
  };

  function SlideShow_createDot() {
    var ul = document.createElement('ul');
    ul.className = this._class.slice(1) + '-dot';

    for (var i = 0; i < this._items.length; i++) {
      var li = document.createElement('li');

      li.eventParam = i;
      li.addEventListener(
        'click',
        this.click.bind(this),
        {passive: true}
      );

      this._dots[i] = li;
      ul.appendChild(li);
    }

    this._dots[0].classList.add('active');
    this._dots[0].style.cursor = 'default';

    this._container.appendChild(ul);
  };

  function SlideShow_start() {
    this._timer = setInterval(this.loop.bind(this), this._duration);
  };

  function SlideShow_loop() {
    this._count += 1;
    if (this._count >= this._total) {
      clearInterval(this._timer);
    }

    if (this._flag) {
      this._items[this._now].style.zIndex = 2;
      this._items[this._next].style.zIndex = 5;
      this._items[this._next].classList.add('active');

      this._removeListener = this.remove.bind(this);
      this._items[this._next].addEventListener(
        'animationend',
        this._removeListener,
        {passive: true}
      );

      this._dots[this._now].classList.remove('active');
      this._dots[this._now].style.cursor = 'pointer';
      this._dots[this._next].classList.add('active');
      this._dots[this._next].style.cursor = 'default';

      this._flag = false;
    }
  };

  function SlideShow_remove(e) {
    if (e.animationName == 'slideshow') {
      this._items[this._next].removeEventListener(
        'animationend',
        this._removeListener,
        {passive: true}
      );
      this._items[this._now].classList.remove('active');
      this._now = this._next;
      this._next = _returntozero(this._next + 1, this._items.length);
      this._flag = true;
    }
  };

  function SlideShow_click(e) {
    switch (e.target.eventParam) {
      case 'forward':
        this._next = _returntozero(this._now + 1, this._items.length);
        break;
          
      case 'prev':
        this._next = _turnover(this._now - 1, this._items.length);
        break;

      default:
        if (this._now != e.target.eventParam) {
          this._next = e.target.eventParam;
        };
        break;
    }

    clearInterval(this._timer);
    this.loop.bind(this)();
    this._timer = setInterval(this.loop.bind(this), this._duration);
  }

  function _turnover(num, length) {
    if (num < 0) {
      num = length - 1;
    }
    return num;
  };

  function _returntozero(num, length) {
    if (num > length - 1) {
      num = 0;
    }
    return num;
  };

  return SlideShow;
});
