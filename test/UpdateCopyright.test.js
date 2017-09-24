import fs from 'fs'
import { assert } from 'chai'
import { launch } from 'chrome-launcher'
import CDP from 'chrome-remote-interface'

const URL = 'about:blank';
const HTML = './test/UpdateCopyright.test.html';
const JS = './modules/UpdateCopyright.js';

const fetch = (filename) => {
  return fs.readFileSync(filename, 'utf-8');
}

const launchChrome = async () => {
  try {
    return await launch({
      port: 9222,
      startingUrl: 'about:blank',
      chromeFlags: ['--headless', '--disable-gpu', '--no-sandbox']
    });
  } catch(error) {
    console.error(error);
  }
}

describe('UpdateCopyright', () => {
  it('結果が2017となるか', (done) => {

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
        const el = document.body.querySelector('.copyright');
        // console.log(el);
        return el.innerHTML;
      })()`;
      const res = await Runtime.evaluate({ expression: exp });
      // console.log(res);

      try {
        assert.equal(res.result.value, '2017');
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
