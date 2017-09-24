import fs from 'fs'
import { assert } from 'chai'
import { launch } from 'chrome-launcher'
import CDP from 'chrome-remote-interface'
import { dir } from '../gulp/dir.es6'

const URL = 'about:blank';
const HTML = './test/DetectViewport.test.html';
const JS = './modules/DetectViewport.js';

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

describe('DetectViewport', () => {

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
        assert.notEqual(res.result.subtype, 'errors');
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
