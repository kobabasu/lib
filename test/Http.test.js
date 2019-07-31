import fs from 'fs'
import { assert } from 'chai'
import sinon from 'sinon'
import jsdom from 'jsdom'
import { launch } from 'chrome-launcher'
import CDP from 'chrome-remote-interface'

import Http from '../src/modules/Http.js'

const URL = 'about:blank';
const HTML = './test/Http.test.html';
// const JS = './src/modules/Http.js';

const dom = new jsdom.JSDOM();
global.window = dom.defaultView;

const fetch = (filename) => {
  const filepath = './' + filename;
  return fs.readFileSync(filepath, 'utf-8');
}

const launchChrome = async () => {
  try {
    return await launch({
      startingUrl: 'about:blank',
      chromeFlags: ['--headless', '--disable-gpu', '--no-sandbox']
    });
  } catch(error) {
    console.error(error);
  }
}

describe('Http', () => {

  let server;
  let spy;

  beforeEach( function() {
    global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();

    server = sinon.fakeServer.create();
    spy = sinon.spy();
  });

  afterEach( function() {
    server.restore();
  });

  it('GET きちんと値を返すか', (done) => {
    const response = {
      'id': 100,
      'name': 'taro'
    };

    const module = new Http();
    const url = '/api/users/';

    module.get(url).then( function(res) {
      spy(res);
      assert.isTrue(spy.calledWith(response));
    }).then(done, done); 

    server.respondWith(
      'GET',
      url,
      [
        200,
        {'Content-Type': 'application/json'},
        JSON.stringify(response)
      ]
    );
    server.respond();
  });

  it('GET 値はobjectか', (done) => {
    const response = {
      'id': 100,
      'name': 'taro'
    };

    const module = new Http();
    const url = '/api/users/100';

    module.get(url).then( function(res) {
      spy(res);
      assert.isObject(res);
    }).then(done, done); 

    server.respondWith(
      'GET',
      url,
      [
        200,
        {'Content-Type': 'application/json'},
        JSON.stringify(response)
      ]
    );
    server.respond();
  });

  it('POST 送信した値が返ってくるか', (done) => {
    const response = {
      'id': 100,
      'name': 'taro'
    };

    const module = new Http();
    const url = '/api/users/';

    module.post(url, response).then( function(res) {
      spy(res);
      assert.isTrue(spy.calledWith(response));
    }).then(done, done); 

    server.respondWith(
      'POST',
      url,
      [
        200,
        {'Content-Type': 'application/json'},
        JSON.stringify(response)
      ]
    );
    server.respond();
  });

  it('PUT 送信した値が返ってくるか', (done) => {
    const response = {
      'name': 'hanako'
    };

    const module = new Http();
    const url = '/api/users/100';

    module.put(url, response).then( function(res) {
      spy(res);
      assert.isTrue(spy.calledWith(response));
    }).then(done, done); 

    server.respondWith(
      'PUT',
      url,
      [
        200,
        {'Content-Type': 'application/json'},
        JSON.stringify(response)
      ]
    );
    server.respond();
  });

  it('DELETE 正常に値が返ってくるか', (done) => {
    const response = {
      'res': '1'
    };

    const module = new Http();
    const url = '/api/users/';

    module.delete(url).then( function(res) {
      spy(res);
      assert.isTrue(spy.calledWith(response));
    }).then(done, done); 

    server.respondWith(
      'DELETE',
      url,
      [
        200,
        {'Content-Type': 'application/json'},
        JSON.stringify(response)
      ]
    );
    server.respond();
  });
});
