/**
 * Http
 *
 * 'div.copyright span'内の年を動的に更新する
 *
 * @param {Object[]} options - 各オプションを指定
 * @param {string} options[].class='.copyright' - 対象となるクラス
 * @param {string} options[].thisyear=Date.getFullYear - 年を指定する
 * @param {string} options[].prefix=null - 年の前に表示する
 * @param {string} options[].debug=false - デバッグモード
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
    Http = factory(global);
  }
})((this || 0).self || global, function(global) {
  'use strict';

  function Http(options) {
    
    options = options || {};

    this._debug = options['debug'] || false ;
  };

  Http.prototype = Object.create(Object.prototype, {
    'constructor': { 'value': Http },
    'init': { 'value': Http_init },
    'get': { 'value': Http_get },
    'post': { 'value': Http_post },
    'put': { 'value': Http_put },
    'delete': { 'value': Http_delete }
  });

  function Http_init(method) {
  };

  function Http_get(url) {
    return new Promise(function(resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);

      xhr.onload = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
          resolve(JSON.parse(xhr.response));
        } else {
          reject(new Error(xhr.statusText));
        };
      };
      xhr.onerror = function () {
        reject(new Error(xhr.statusText));
      };

      xhr.send(null);
    });
  };

  function Http_post(url, obj) {
    return new Promise(function(resolve, reject) {
      var data = JSON.stringify(obj);
      var xhr = new XMLHttpRequest();
      xhr.open('POST', url, true);
      xhr.setRequestHeader('Content-type','application/json; charset=utf-8');

      xhr.onload = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
          resolve(JSON.parse(xhr.response));
        } else {
          reject(new Error(xhr.statusText));
        };
      };
      xhr.onerror = function () {
        reject(new Error(xhr.statusText));
      };

      xhr.send(data);
    });
  };

  function Http_put(url, obj) {
    return new Promise(function(resolve, reject) {
      var data = JSON.stringify(obj);
      var xhr = new XMLHttpRequest();
      xhr.open('PUT', url, true);
      xhr.setRequestHeader('Content-type','application/json; charset=utf-8');

      xhr.onload = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
          resolve(JSON.parse(xhr.response));
        } else {
          reject(new Error(xhr.statusText));
        };
      };
      xhr.onerror = function () {
        reject(new Error(xhr.statusText));
      };

      xhr.send(data);
    });
  };

  function Http_delete(url) {
    return new Promise(function(resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.open('DELETE', url, true);

      xhr.onload = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
          resolve(JSON.parse(xhr.response));
        } else {
          reject(new Error(xhr.statusText));
        };
      };
      xhr.onerror = function () {
        reject(new Error(xhr.statusText));
      };

      xhr.send(null);
    });
  };

  return Http;
});
