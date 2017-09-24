import fs from 'fs'
import { assert } from 'chai'
import { launch } from 'chrome-launcher'
import CDP from 'chrome-remote-interface'

const HTML = './test/Chrome.test.html';
// const JS = './modules/UpdateCopyright.js';

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

describe('chrome-headless-sample', () => {
  it('titleを評価できるか', (done) => {

    launchChrome().then(async (chrome) => {
      const client = await CDP({ port: chrome.port });
      const { Page, Runtime, Console } = client;
      await Promise.all([
        Page.enable(),
        Runtime.enable(),
        Console.enable()
      ]);

      Console.messageAdded((msg) => cosole.log(msg));

      const blank = await Page.navigate({ url: 'target:blank' });
      await Page.setDocumentContent({
        frameId: blank.frameId,
        html: fetch(HTML)
      });

      // await Page.addScriptToEvaluateOnLoad({
      //   scriptSource: JS
      // });

      // await Page.loadEventFired();

      var exp = `document.querySelector('title').innerHTML`;
      var title = await Runtime.evaluate({
        expression: exp 
      });

      try {
        assert.equal(title.result.value, 'sample');
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
