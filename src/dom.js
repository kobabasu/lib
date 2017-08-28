/**
 * dom.js
 *
 * ImageSrcset
 * DetectViewport
 * SlideMenu
 * HumbergerMenu
 * InnerLink
 * ScrollTop
 * InView
 * SlideShow
 * RippleEffect
 * ScrollIt
 * UpdateCopyright
 *
 * @file ページで利用するクラス
 */


/**
 * ImageSrcset
 *
 * 画像の先読み、遅延読み込み、retina変換
 *
 * @param {Object[]} options - 各オプションを指定
 * @param {string} options[].attr='data-original' - 対象となる属性
 * @param {string} options[].class-fit='.srcset-fit' - サイズを変更する対象
 * @param {string} options[].class-lazyload='.lazyload' - 遅延読み込み対象
 * @param {number} options[].margin=-300 - 読み込み開始のしきい値
 * @param {array} options[].threshhold - srcset-fitのしきい値とsuffix
 * @param {function} options[].loaded-without-lazyload - lazyload以外が完了時実行
 * @param {function} options[].complete - すべてが完了時実行
 *
 * @return {void}
 */
(function(global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory(global));
  } else if (typeof exports === 'object') {
    module.exports = factory(global);
  } else {
    ImageSrcset = factory(global);
  }
})((this || 0).self || global, function(global) {

  var ATTR_NAME = 'data-original';
  var CLASS_NAME_FIT = '.srcset-fit';
  var CLASS_NAME_LAZYLOAD = '.lazyload';
  var TRIGGER_MARGIN = -300;
  var THRESHHOLD = [
    { 'suffix': '-s',  'size': 767 },
    { 'suffix': '-l',  'size': 1280 },
    { 'suffix': '-xl', 'size': 1920 } 
  ];

  function ImageSrcset(options) {

    options = options || {} ;

    this._attr = options['attribute'] || ATTR_NAME ;
    this._classFit = options['class-fit'] || CLASS_NAME_FIT ;
    this._classLazy = options['class-lazyload'] || CLASS_NAME_LAZYLOAD ;
    this._margin = options['margin'] || TRIGGER_MARGIN;
    this._threshhold = options['threshhold'] || THRESHHOLD ;
    this._loadedWithoutLazyload = options['loaded-without-lazyload'] || function() {} ;
    this._complete = options['complete'] || function() {} ;

    this._min = this._threshhold.shift();
    this._max = this._threshhold.pop();
    this._dpx = global.windowDeviceRatio || 1 ;
    this._width = global.document.body.clientWidth ;

    this._els = null;
    this._css = null;
    this._elsLazy = null;
    this._cssLazy = null;
    this._totalWithoutLazyload = 0;
    this._total = 0;

    this.init();
  }

  ImageSrcset.prototype = Object.create(Object.prototype, {
    'constructor': { 'value': ImageSrcset },
    'init': { 'value': ImageSrcset_init },
    'change': { 'value': ImageSrcset_change },
    'lazyload': { 'value': ImageSrcset_lazyload },
    'loaded': { 'value': ImageSrcset_loaded }
  });

  function ImageSrcset_init() {
    var tgt, filename, path;

    tgt = ':not(' + this._classLazy + ')[' + this._attr + ']';
    this._els = global.document.body.querySelectorAll(tgt);

    tgt = ':not(' + this._classLazy + ')[' + this._attr + '-background]';
    this._css = global.document.body.querySelectorAll(tgt);

    for (var i = 0; i < this._els.length; i++) {
      this.change(this._els[i], true);
    }

    for (var i = 0; i < this._css.length; i++) {
      this.change(this._css[i], false);
    }

    tgt = this._classLazy + '[' + this._attr + ']';
    var elsLazy = global.document.body.querySelectorAll(tgt);
    this._elsLazy = Object.keys(elsLazy)
      .map(function(key) { return elsLazy[key];});

    tgt = this._classLazy + '[' + this._attr + '-background]';
    var cssLazy = global.document.body.querySelectorAll(tgt);
    this._cssLazy = Object.keys(cssLazy)
      .map(function(key) { return cssLazy[key];});

    this._totalWithoutLazyload = (
      this._els.length +
      this._css.length
    );

    this._total = (
      this._totalWithoutLazyload +
      this._elsLazy.length +
      this._cssLazy.length
    );

    this.lazyload();
  }

  function ImageSrcset_change(el, flag) {
    var original, filename, path;
    if (flag) {
      original = el.getAttribute(this._attr);
    } else {
      original = el.getAttribute(this._attr + '-background');
    }
    var str = _parse(original);

    if (str.extention.match(/^(gif|jpeg|jpg|png)$/)) {
      if (el.classList.contains(this._classFit.slice(1))) {
        filename = _detectWidth(
          this._min,
          this._max,
          this._threshhold,
          str.name
        );
      } else {
        filename = str.name;
      }

      filename = _detectDpx(filename);
      path = str.dir + filename + '.' + str.extention;

      var img = new Image();
      img.onload = function() {
        if (flag) {
          el.src = path;
        } else {
          el.style.backgroundImage = 'url(' + path + ')';
        }
        this.loaded();
      }.bind(this);

      img.onerror = function() {
        if (flag) {
          el.src = original;
        } else {
          el.style.backgroundImage = 'url(' + original + ')';
        }
      };

      img.src = path;
    }
  }

  function ImageSrcset_lazyload() {
    Object.keys(this._elsLazy).forEach(function(key) {
      var loc = this._elsLazy[key].getBoundingClientRect().top;
      if (global.innerHeight - loc > this._margin) {
        this.change(this._elsLazy[key], true);
        delete this._elsLazy[key];
      } 
    }.bind(this));

    Object.keys(this._cssLazy).forEach(function(key) {
      var loc = this._cssLazy[key].getBoundingClientRect().top;
      if (global.innerHeight - loc > this._margin) {
        this.change(this._cssLazy[key], false);
        delete this._cssLazy[key];
      } 
    }.bind(this));
  }

  function ImageSrcset_loaded() {
    this._totalWithoutLazyload--;
    this._total--;

    if (this._totalWithoutLazyload == 0) {
      this._loadedWithoutLazyload();
    }

    if (this._total == 0) {
      this._complete();
    }
  }

  function _detectWidth(min, max, threshhold, name) {
    var width = global.document.body.clientWidth;
    var suffix = '';

    if (threshhold.length > 0) {
      if (width <= min.size) {
        suffix = min.suffix;
      } else if (width >= max.size) {
        suffix = max.suffix;
      } else {
        threshhold.forEach(function(obj) {
          if (width > obj.size) {
            suffix = obj.suffix;
          }
        });
      }
    }

    return name + suffix;
  }

  function _detectDpx(name) {
    var dpx = global.windowDeviceRatio;
    var suffix = '';

    if (dpx <= 1) {
      suffix = '';
    } else if (dpx > 2) {
      suffix = '@3x';
    } else {
      suffix = '@2x';
    };

    return name + suffix;
  }

  function _parse(attr) {
    var filename = attr.split('/').pop();
    var arr = filename.split('.');

    return {
      dir: attr.replace(filename, '') || '',
      name: arr[0].replace(/\@.*$/, '') || '',
      extention: arr[1] || ''
    };
  }

  return ImageSrcset;  
});


/**
 * DetectViewport
 *
 * window.matchMediaを利用してviewportを検出
 * 
 * @param {Object[]} options - 各オプションを指定
 * @param {string} options[].name='sp' - viewportの名前 consoleに表示
 * @param {string} options[].viewport='(max-width: 767px)' - viewport
 *
 * @return {void}
 */
(function(global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory(global));
  } else if (typeof exports === 'object') {
    module.exports = factory(global);
  } else {
    DetectViewport = factory(global);
  }
})((this || 0).self || global, function(global) {
  'use strict';

  function DetectViewport(options) {

    options = options || {};

    this._name = options['name'] || 'sp';
    this._viewport = options['viewport'] || '(max-width: 767px)';

    this.listen();
  }

  DetectViewport.prototype = Object.create(Object.prototype, {
    'constructor': { 'value': DetectViewport },
    'listen': { 'value': DetectViewport_listen }
  });

  function DetectViewport_listen() {
    var name = this._name;
    global.matchMedia(this._viewport).addListener(function(e) {
      if (e.matches) {
        console.log(name);
      }
    });
  }

  return DetectViewport;
});


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


/**
 * InnerLink
 *
 * インナーリンクにスクロールを加える
 *
 * @return {void}
 */
(function(global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory(global));
  } else if (typeof exports === 'object') {
    module.exports = factory(global);
  } else {
    InnerLink = factory(global);
  }
})((this || 0).self || global, function(global) {
  'use strict';

  var FIXED = -100;

  global.requestAnimFrame = (function(){
    return  global.requestAnimationFrame       ||
            global.webkitRequestAnimationFrame ||
            global.mozRequestAnimationFrame    ||
            function( callback ){
              global.setTimeout(callback, 1000 / 60);
            };
  })();

  function InnerLink(options) {

    options = options || {} ;

    this._links = global.document.documentElement
      .querySelectorAll('a[href^="#"]');
    for (var i = 0; i < this._links.length; i++) {
      this._links[i].addEventListener(
        'click',
        _click,
        {passive: true}
      );
    };
  }

  InnerLink.prototype = Object.create(Object.prototype, {
    'constructor': { 'value': InnerLink }
  });

  function _click(e) {
    var hash = e.target.getAttribute('href') ||
        e.target.parentNode.getAttribute('href');

    if (hash && hash.match(/^#.*/)) {
      var el = global.document.getElementById(hash.replace(/#/g, ''));
      if (el) {
        _scroll(el.offsetTop + FIXED, 50, 'easeInOutQuint');
      }
    }
  }

  function _scroll(scrollTargetY, speed, easing) {
    var scrollY = global.pageYOffset,
      scrollTargetY = scrollTargetY || 0,
      speed = speed || 2000,
      easing = easing || 'easeOutSine',
      currentTime = 0;

    var time = Math.max(
      .1,
      Math.min(Math.abs(scrollY - scrollTargetY) / speed, .8)
    );

    var easingEquations = {
      easeOutSine: function (pos) {
        return Math.sin(pos * (Math.PI / 2));
      },
      easeInOutSine: function (pos) {
        return (-0.5 * (Math.cos(Math.PI * pos) - 1));
      },
      easeInOutQuint: function (pos) {
        if ((pos /= 0.5) < 1) {
          return 0.5 * Math.pow(pos, 5);
        }
        return 0.5 * (Math.pow((pos - 2), 5) + 2);
      }
    };

    function tick() {
      currentTime += 1 / 60;

      var p = currentTime / time;
      var t = easingEquations[easing](p);

      if (p < 1) {
        global.requestAnimFrame(tick);

        global.scrollTo(0, scrollY + ((scrollTargetY - scrollY) * t));
      } else {
        // console.log('scroll done');
        global.scrollTo(0, scrollTargetY);
      }
    }
    tick();
  }

  return InnerLink;
});


/**
 * ScrollTop
 *
 * @param {Object[]} options - 各オプションを指定
 * @param {string} options[].class='.scrolltop' - スクロールアイコンのクラス
 *
 * @return {void}
 */
(function(global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory(global));
  } else if (typeof exports === 'object') {
    module.exports = factory(global);
  } else {
    ScrollTop = factory(global);
  }
})((this || 0).self || global, function(global) {
  'use strict';

  var CLASS_NAME = '.scrolltop';
  var MARGIN_BOTTOM_ELEMENT = 'footer';
  var DISTANCE = 5;

  function ScrollTop(options) {

    options = options || {} ;

    this._class = options['class'] || CLASS_NAME ;
    this._target = global.document.querySelector(this._class);
    this._bottomElement = global.document
      .querySelector(MARGIN_BOTTOM_ELEMENT);
  }

  ScrollTop.prototype = Object.create(Object.prototype, {
    'constructor': { 'value': ScrollTop },
    'animate': { 'value': ScrollTop_animate }
  });

  function ScrollTop_animate() {
    var pos = global.innerHeight - this._bottomElement
      .getBoundingClientRect().top;

    if (pos > 0) {
      this._target.style.bottom = pos + DISTANCE + 'px';
    } else {
      this._target.style.bottom = DISTANCE + 'px';
    };
    this._target.style.zIndex = 9999;
  }

  return ScrollTop;
});


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


/**
 * RippleEffect
 *
 * ripple effectを追加する
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

    this.init();
  }

  RippleEffect.prototype = Object.create(Object.prototype, {
    'constructor': { 'value': RippleEffect },
    'init': { 'value': RippleEffect_init }
  });

  function RippleEffect_init() {
    var els = document.querySelectorAll(this._class);
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

  function UpdateCopyright(options) {
    
    options = options || {};

    this._class = options['class'] || CLASS_NAME ;
    this._thisyear = options['thisyear'] || _getThisyear();
    this._prefix = options['prefix'] || null;
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

  function _change(el, prefix, year) {
    el.innerHTML = prefix + year;
  };

  function _getThisyear() {
    return new Date().getFullYear();
  };

  return UpdateCopyright;
});


// vim: foldmethod=marker:ts=2:sts=0:sw=2
