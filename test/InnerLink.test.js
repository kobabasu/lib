import fs from 'fs'
import { assert } from 'chai'
import { launch } from 'chrome-launcher'
import CDP from 'chrome-remote-interface'
import { dir } from '../gulp/dir.es6'

const URL = 'about:blank';
const HTML = './test/InnerLink.test.html';
const JS = './modules/InnerLink.js';

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

describe('InnerLink', () => {

  it('リンク先までスクロールするか', (done) => {

    launchChrome().then(async (chrome) => {
      const client = await CDP({ port: chrome.port });
      const { Page, Runtime, DOM, Emulation, Console } = client;
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

      // スクロール量を取得するためにheightなどを1に
      Emulation.setDeviceMetricsOverride({
        width: 0,
        height: 1,
        deviceScaleFactor: 0,
        mobile: false,
        screenHeight: 1,
        fitWindow: false
      });


      // スクロールされるべき量を取得 cssのtopと同じ値
      let exp = `(() => {
        const el = document.querySelector('footer');
        return el.offsetTop;
      })();`;
      const height = await Runtime.evaluate({
        expression: exp
      });
      // console.log(height);

      // InnerLinkのfixedの値を保存
      const innerLinkFixed = 0;
      exp = `(async () => {
        const module = new InnerLink({ fixed: ${innerLinkFixed} });
        await module.init();
        const btn = document.querySelector('#button');
        const el = document.querySelector('footer');

        const ev = document.createEvent('MouseEvents');
        await ev.initEvent('click', true, true);
        await btn.dispatchEvent(ev);

        await new Promise(resolve => setTimeout(resolve, 1000));
        return window.pageYOffset;
      })()`;
      const res = await Runtime.evaluate({
        expression: exp,
        awaitPromise: true
      });
      // console.log(res);
      try {
        const ans = height.result.value + innerLinkFixed;

        // スクロール量からfixedを追加した値となるべき
        assert.equal(res.result.value, ans);
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
