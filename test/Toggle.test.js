import fs from 'fs'
import { assert } from 'chai'
import sinon from 'sinon'
import { JSDOM } from 'jsdom'
import { launch } from 'chrome-launcher'
import CDP from 'chrome-remote-interface'

import { dir } from '../gulp/dir.es6'
import Toggle from '../src/modules/Toggle.js'

const URL = 'about:blank';
const HTML = './test/Toggle.test.html';
const JS = './src/modules/Toggle.js';

const fetch = (filename) => {
  const filepath = dir.root + '/' + filename;
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

describe('Toggle', () => {

  it('クラスが存在しない場合undefinedを返すか', () => {
    const module = new Toggle();
    assert.isUndefined(module.init());
  });

  it('debugがtrueでエラーが表示されるか', () => {
    const module = new Toggle();
    const spy = sinon.spy(console, 'log');
    const msg = 'Toggle: ';
    module._debug = true;
    module.log('test');

    assert.isTrue(spy.calledWith(msg + 'test'));
    spy.restore();
  });

  it('E2E: クリックしたときにクラスが追加されるか', (done) => {

    launchChrome().then(async (chrome) => {
      const client = await CDP({ port: chrome.port });
      const { Page, Runtime, Console } = client;
      await Promise.all([
        Page.enable(),
        Runtime.enable(),
        Console.enable()
      ]);

      Console.messageAdded((msg) => console.log(msg));

      await Page.addScriptToEvaluateOnLoad({
        scriptSource: fetch(JS)
      });

      const frame = await Page.navigate({ url: URL });
      Page.loadEventFired();

      await Page.setDocumentContent({
        frameId: frame.frameId,
        html: fetch(HTML)
      });

      var exp = `(() => {
        const module = new Toggle();
        module.init();
      })()`;
      await Runtime.evaluate({ expression: exp });

      const options = {
        x: 10,
        y: 10,
        button: 'left',
        clickCount: 1
      };

      options.type = 'mousePressed';
      await client.Input.dispatchMouseEvent(options);
      options.type = 'mouseReleased';
      await client.Input.dispatchMouseEvent(options);

      exp = `(() => {
        const el = document.querySelectorAll('.toggle');
        return el[0].classList.contains('toggle-active');
      })()`;
      const res = await Runtime.evaluate({ expression: exp });

      try {
        assert.equal(res.result.value, true);
      } catch(error) {
        return done(error);
      } finally {
        client.close();
        chrome.kill();
      }

      done();
    });
  });

  it('E2E: with-change-valueが機能するか', (done) => {

    launchChrome().then(async (chrome) => {
      const client = await CDP({ port: chrome.port });
      const { Page, Runtime, Console } = client;
      await Promise.all([
        Page.enable(),
        Runtime.enable(),
        Console.enable()
      ]);

      Console.messageAdded((msg) => console.log(msg));

      await Page.addScriptToEvaluateOnLoad({
        scriptSource: fetch(JS)
      });

      const frame = await Page.navigate({ url: URL });
      Page.loadEventFired();

      await Page.setDocumentContent({
        frameId: frame.frameId,
        html: fetch(HTML)
      });

      var exp = `(() => {
        const module = new Toggle();
        module.init();
      })()`;
      await Runtime.evaluate({ expression: exp });

      const options = {
        x: 80,
        y: 10,
        button: 'left',
        clickCount: 1
      };

      options.type = 'mousePressed';
      await client.Input.dispatchMouseEvent(options);
      options.type = 'mouseReleased';
      await client.Input.dispatchMouseEvent(options);

      exp = `(() => {
        const els = document.querySelectorAll('.toggle');
        return els[1].innerHTML;
      })()`;
      const res = await Runtime.evaluate({ expression: exp });

      try {
        assert.equal(res.result.value, 'checked');
      } catch(error) {
        return done(error);
      } finally {
        client.close();
        chrome.kill();
      }

      done();
    });
  });
});
