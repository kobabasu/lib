import fs from 'fs'
import { assert } from 'chai'
import { launch } from 'chrome-launcher'
import CDP from 'chrome-remote-interface'
import { dir } from '../gulp/dir.es6'

const URL = 'about:blank';
const HTML = './test/ScrollTop.test.html';
const JS = './modules/ScrollTop.js';

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

describe('ScrollTop', () => {

  it('init()でクラスがなくともエラーとならないか', (done) => {

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
        var module = new ScrollTop();
        return module.init();
      })()`;
      const res = await Runtime.evaluate({ expression: exp });

      // console.log(res);
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


  it('animate()でクラスがなくともエラーとならないか', (done) => {

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
        var module = new ScrollTop();
        module.init();
        return module.animate();
      })()`;
      const res = await Runtime.evaluate({ expression: exp });

      // console.log(res);
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


  it('スクロールしない状態でページ最下部に位置しているか', (done) => {

    launchChrome().then(async (chrome) => {
      const client = await CDP({ port: chrome.port });
      const { Page, Runtime, DOM, Emulation, Console, Input } = client;
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

      const windowHeight = 1000;
      Emulation.setDeviceMetricsOverride({
        width: 0,
        height: windowHeight,
        deviceScaleFactor: 0,
        mobile: false,
        screenHeight: windowHeight,
        fitWindow: false
      });

      // .scrolltopの高さを取得
      let exp = `(() => {
        const el = document.querySelector('.scrolltop');
        return el.clientHeight;
      })();`;
      let targetHeight = await Runtime.evaluate({
        expression: exp
      });
      targetHeight = targetHeight.result.value;

      // footerの高さを取得
      exp = `(() => {
        const el = document.querySelector('footer');
        return el.clientHeight;
      })();`;
      let trackedHeight = await Runtime.evaluate({
        expression: exp
      });
      trackedHeight = trackedHeight.result.value;

      // bodyのmarginをゼロにし、.scrolltopの位置を取得
      const margin = 5;
      exp = `(async () => {
        document.body.style.margin = 0;
        const module = await new ScrollTop({
          margin: ${margin}
        });
        await module.init();

        await module.animate();

        const el = document.querySelector('.scrolltop');
        return el.getBoundingClientRect().top;
      })()`;
      const res = await Runtime.evaluate({
        expression: exp,
        awaitPromise: true
      });
      // console.log(res);
      try {
        // ページの高さから.scrolltopの高さを引く
        // bodyのmarginはevaluate内でゼロにしている
        const el = targetHeight + margin;
        const ans = windowHeight - el;
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

  it('ページ最下部までスクロールするとfooterの上に位置しているか', (done) => {

    launchChrome().then(async (chrome) => {
      const client = await CDP({ port: chrome.port });
      const { Page, Runtime, DOM, Emulation, Console, Input } = client;
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

      const windowHeight = 1000;
      Emulation.setDeviceMetricsOverride({
        width: 0,
        height: windowHeight,
        deviceScaleFactor: 0,
        mobile: false,
        screenHeight: windowHeight,
        fitWindow: false
      });

      // .scrolltopの高さを取得
      let exp = `(() => {
        const el = document.querySelector('.scrolltop');
        return el.clientHeight;
      })();`;
      let targetHeight = await Runtime.evaluate({
        expression: exp
      });
      targetHeight = targetHeight.result.value;

      // footerの高さを取得
      exp = `(() => {
        const el = document.querySelector('footer');
        return el.clientHeight;
      })();`;
      let trackedHeight = await Runtime.evaluate({
        expression: exp
      });
      trackedHeight = trackedHeight.result.value;

      // bodyのmarginをゼロにし、.scrolltopの位置を取得
      const margin = 5;
      exp = `(async () => {
        document.body.style.margin = 0;
        const module = await new ScrollTop({
          margin: ${margin}
        });
        await module.init();

        await window.scrollTo(0, 9999);

        await module.animate();

        const el = document.querySelector('.scrolltop');
        return el.getBoundingClientRect().top;
      })()`;
      const res = await Runtime.evaluate({
        expression: exp,
        awaitPromise: true
      });
      // console.log(res);
      try {
        // ページの高さから.scrolltopの高さを引く
        // bodyのmarginはevaluate内でゼロにしている
        // footerも引いていることに注意
        const el = targetHeight + margin;
        const ans = windowHeight - el - trackedHeight;
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
