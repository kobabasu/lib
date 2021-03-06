/**
 * InnerLink
 *
 * インナーリンクにスクロールを加える
 * @param {Object[]} options - 各オプションを指定
 * @param {string} options[].fixed=-100 - スクロールを止める対象からの位置
 *
 * @return {void}
 */
(function(global, factory) {
  /* istanbul ignore next */
  if (typeof define === 'function' && define.amd) {
    define(factory(global));
  } else if (typeof exports === 'object') {
    module.exports.InnerLink = factory(global);
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

    this._fixed = (isFinite(options['fixed'])) ? options['fixed'] : FIXED ;
  }

  InnerLink.prototype = Object.create(Object.prototype, {
    'constructor': { 'value': InnerLink },
    'init': { 'value': InnerLink_init }
  });

  function InnerLink_init() {
    var links = global.document.documentElement
      .querySelectorAll('a[href^="#"]');

    for (var i = 0; i < links.length; i++) {
      links[i].fixed = this._fixed;
      links[i].addEventListener(
        'click',
        _click,
        {passive: true}
      );
    };
  }

  function _click(e) {
    var hash = e.target.getAttribute('href') ||
        e.target.parentNode.getAttribute('href');

    if (hash && hash.match(/^#.*/)) {
      var el = global.document.getElementById(hash.replace(/#/g, ''));
      if (el) {
        _scroll(el.offsetTop + e.target.fixed, 50, 'easeInOutQuint');
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
