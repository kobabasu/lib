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

  it('ブラウザ幅766pxでtrueとなるか', (done) => {

    launchChrome().then(async (chrome) => {
      const client = await CDP({ port: chrome.port });
      const { Page, Runtime, Emulation, Console } = client;
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

      await Emulation.setVisibleSize({
        width: 766,
        height: 1080
      });

      const exp = `(() => {
        const module = new DetectViewport({
          viewport: '(max-width: 767px)'
        });
        return module.getStatus();
      })()`;
      const res = await Runtime.evaluate({ expression: exp });
      // console.log(res);
      try {
        assert.isTrue(res.result.value);
      } catch(error) {
        return done(error);
      } finally {
        client.close();
        chrome.kill();
      }

      done();
    });
  });

  it('ブラウザ幅767pxでtrueとなるか', (done) => {

    launchChrome().then(async (chrome) => {
      const client = await CDP({ port: chrome.port });
      const { Page, Runtime, Emulation, Console } = client;
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

      await Emulation.setVisibleSize({
        width: 767,
        height: 1080
      });

      const exp = `(() => {
        const module = new DetectViewport({
          viewport: '(max-width: 767px)'
        });
        return module.getStatus();
      })()`;
      const res = await Runtime.evaluate({ expression: exp });
      // console.log(res);
      try {
        assert.isTrue(res.result.value);
      } catch(error) {
        return done(error);
      } finally {
        client.close();
        chrome.kill();
      }

      done();
    });
  });

  it('ブラウザ幅768pxでfalseとなるか', (done) => {

    launchChrome().then(async (chrome) => {
      const client = await CDP({ port: chrome.port });
      const { Page, Runtime, Emulation, Console } = client;
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

      await Emulation.setVisibleSize({
        width: 768,
        height: 1080
      });

      const exp = `(() => {
        const module = new DetectViewport({
          viewport: '(max-width: 767px)'
        });
        return module.getStatus();
      })()`;
      const res = await Runtime.evaluate({ expression: exp });
      // console.log(res);
      try {
        assert.isFalse(res.result.value);
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
