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
        positionX: 0,
        positionY: 0
      });


      // スクロールされるべき量を取得 cssのtopと同じ値
      let exp = `(() => {
        var el = document.querySelector('footer');
        return el.offsetTop;
      })();`;
      const height = await Runtime.evaluate({
        expression: exp
      });
      // console.log(height);

      // InnerLinkのfixedの値を保存
      const innerLinkFixed = -100;
      exp = `(() => {
        return new Promise((resolve, reject) => {
          new InnerLink({ fixed: ${innerLinkFixed} });
          var btn = document.querySelector('#button');
          var el = document.querySelector('footer');

          var ev = document.createEvent('MouseEvents');
          ev.initEvent('click', true, true);
          btn.dispatchEvent(ev);

          setTimeout(() => {
            resolve(window.pageYOffset);
          }, 1000);
        });
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
