/**
 * DetectViewport
 *
 * window.matchMediaを利用してviewportを検出
 * 
 * @param {Object[]} options - 各オプションを指定
 * @param {string} options[].name='sp' - viewportの名前 consoleに表示
 * @param {string} options[].viewport='(max-width: 767px)' - viewport
 * @param {Boolean} optoins[].debug=false - デバッグモード
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

  var DEBUG = false ;

  function DetectViewport(options) {

    options = options || {};

    this._name = options['name'] || 'sp';
    this._viewport = options['viewport'] || '(max-width: 767px)';
    this._debug = options['debug'] || DEBUG ;
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
      return this.setStatus(e.matches);
    }.bind(this));
  }

  function DetectViewport_setStatus(status) {
    if (status) {
      this.status = true;
    } else {
      this.status = global.matchMedia(this._viewport).matches;
    }

    if (this._debug) _showStatus(this.status);
    return this.status;
  }

  function DetectViewport_getStatus() {
    return this.status;
  }

  function _showStatus(status) {
    var msg = 'DetectViewport: matchMedia status is '
    console.log(msg + status);
  }

  return DetectViewport;
});
