import fs from 'fs'
import { assert } from 'chai'
import { launch } from 'chrome-launcher'
import CDP from 'chrome-remote-interface'
import { dir } from '../gulp/dir.es6'

const URL = 'about:blank';
const HTML = './test/UpdateCopyright.test.html';
const JS = './modules/UpdateCopyright.js';

const fetch = (filename) => {
  const filepath = dir.root + filename;
  return fs.readFileSync(filename, 'utf-8');
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

  it('クラスがなくともエラーとならないか', (done) => {

    launchChrome().then(async (chrome) => {
      const client = await CDP({ port: chrome.port });
      const { Page, Runtime, DOM, Console } = client;
      await Promise.all([
        Page.enable(),
        Runtime.enable(),
        DOM.enable(),
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

      const body = await DOM.getDocument();
      const el = await DOM.querySelector({
        nodeId: body.root.nodeId,
        selector: '.copyright'
      });
      await DOM.removeNode({ nodeId: el.nodeId });

      const exp = `(() => {
        const module = new UpdateCopyright();
        return module.init();
      })()`;
      const res = await Runtime.evaluate({ expression: exp });
      // console.log(res);

      const thisyear = new Date().getFullYear();
      try {
        assert.notEqual(res.result.subtype, 'error');
      } catch(error) {
        return done(error);
      } finally {
        client.close();
        chrome.kill();
      }

      done();
    });
  });


  it('結果が今年となるか', (done) => {

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
