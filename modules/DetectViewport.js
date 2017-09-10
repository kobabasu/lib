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
    this.status = this.setStatus();
  }

  DetectViewport.prototype = Object.create(Object.prototype, {
    'constructor': { 'value': DetectViewport },
    'listen': { 'value': DetectViewport_listen },
    'setStatus': { 'value': DetectViewport_setStatus },
    'getStatus': { 'value': DetectViewport_getStatus }
  });

  function DetectViewport_listen() {
    var name = this._name;
    global.matchMedia(this._viewport).addListener(function(e) {
      return e.matches;
    });
  }

  function DetectViewport_setStatus(status) {
    if (status) {
      this.status = true;
    } else {
      this.status = global.matchMedia(this._viewport).matches;
    }

    return this.status;
  }

  function DetectViewport_getStatus() {
    return this.status;
  }

  return DetectViewport;
});
