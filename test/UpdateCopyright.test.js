import fs from 'fs'
import { assert } from 'chai'
import sinon from 'sinon'
import { JSDOM } from 'jsdom'
import { launch } from 'chrome-launcher'
import CDP from 'chrome-remote-interface'

import { dir } from '../gulp/dir.es6'
import UpdateCopyright from '../modules/UpdateCopyright.js'

const URL = 'about:blank';
const HTML = './test/UpdateCopyright.test.html';
const JS = './modules/UpdateCopyright.js';

const fetch = (filename) => {
  const filepath = dir.root + filename;
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

describe('UpdateCopyright', () => {

  it('クラスが存在しない場合undefinedを返すか', () => {
    const module = new UpdateCopyright();
    assert.isUndefined(module.init());
  });


  it('クラスが存在する場合今年に変更されるか', () => {
    const dom = new JSDOM(`
      <span class="copyright">2000</span>
    `);

    global.document = dom.window.document;
    const module = new UpdateCopyright();
    module.init();

    const el = dom.window.document
      .querySelector('.copyright');
    const res = el.innerHTML;
    const thisyear = new Date().getFullYear();

    assert.equal(res, thisyear);
  });


  it('debugがtrueでエラーが表示されるか', () => {
    const module = new UpdateCopyright();
    const spy = sinon.spy(console, 'log');
    const msg = 'UpdateCopyright: ';
    module._debug = true;
    module.log('test');

    assert.isTrue(spy.calledWith(msg + 'test'));
  });


  it('E2E: 結果が今年となるか', (done) => {

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

      const exp = `(() => {
        const module = new UpdateCopyright();
        module.init();
        const el = document.querySelector('.copyright');
        // console.log(el);
        return el.innerHTML;
      })()`;
      const res = await Runtime.evaluate({ expression: exp });
      // console.log(res);

      const thisyear = new Date().getFullYear();
      try {
        assert.equal(res.result.value, thisyear);
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
