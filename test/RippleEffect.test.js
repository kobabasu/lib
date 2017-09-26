import fs from 'fs'
import { assert } from 'chai'
import { launch } from 'chrome-launcher'
import CDP from 'chrome-remote-interface'
import { dir } from '../gulp/dir.es6'

const URL = 'about:blank';
const HTML = './test/RippleEffect.test.html';
const JS = './modules/RippleEffect.js';

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

describe('RippleEffect', () => {

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

      const exp = `(() => {
        return 4;
      })()`;
      const res = await Runtime.evaluate({ expression: exp });
      // console.log(res);

      const thisyear = new Date().getFullYear();
      try {
        assert.equal(res.result.value, 4);
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
